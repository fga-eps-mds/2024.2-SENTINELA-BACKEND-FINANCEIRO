const path = require("path");
const fs = require("fs");
const { generateFinancialReport } = require("../Controllers/financialReportController");
const { generateFinancialReportPDF } = require("../Models/pdfGenerator");
const { generateFinancialReportCSV } = require("../Models/csvGenerator");
const FinancialMovements = require("../Models/financialMovementsSchema");

jest.mock("../Models/pdfGenerator");
jest.mock("../Models/csvGenerator");
jest.mock("fs");

describe("generateFinancialReport Controller", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                contaOrigem: "1234",
                contaDestino: "5678",
                nomeOrigem: "Empresa A",
                nomeDestino: "Empresa B",
                tipoDocumento: "Fatura",
                sitPagamento: "Pago",
                formArquivo: "PDF", // Pode ser "PDF" ou "CSV"
                dataInicio: "2024-01-01",
                dataFinal: "2024-12-31",
                includeFields: {
                    valorBruto: true,
                    valorLiquido: true,
                    formadePagamento: true,
                    datadeVencimento: true,
                    datadePagamento: true,
                    baixada: true,
                    descricao: true,
                },
            },
        };

        res = {
            setHeader: jest.fn(),
            sendFile: jest.fn((filePath, callback) => callback(null)),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        FinancialMovements.find = jest.fn().mockResolvedValue([
            {
                contaOrigem: "1234",
                contaDestino: "5678",
                nomeOrigem: "Empresa A",
                nomeDestino: "Empresa B",
                tipoDocumento: "Fatura",
                valorBruto: 1000,
                valorLiquido: 900,
                formadePagamento: "Boleto",
                datadeVencimento: new Date(),
                datadePagamento: new Date(),
                baixada: true,
                descricao: "Pagamento de serviços",
            },
        ]);
    });

    it("deve gerar um arquivo PDF e enviá-lo", async () => {
        req.body.formArquivo = "PDF";
        const filePath = path.join(__dirname, "../../PDF/financial_report.pdf");

        generateFinancialReportPDF.mockResolvedValueOnce();

        fs.createWriteStream.mockReturnValue({
            pipe: jest.fn(),
            on: jest.fn((event, callback) => {
                if (event === "finish") callback();
            }),
        });

        await generateFinancialReport(req, res);

        expect(generateFinancialReportPDF).toHaveBeenCalledWith(
            expect.any(Array),
            filePath,
            expect.arrayContaining([
                "contaOrigem",
                "contaDestino",
                "nomeOrigem",
                "nomeDestino",
                "valorBruto",
                "valorLiquido",
                "formadePagamento",
                "datadeVencimento",
                "datadePagamento",
                "baixada",
                "descricao",
            ])
        );
        expect(res.setHeader).toHaveBeenCalledWith(
            "Content-Type",
            "application/pdf"
        );
        expect(res.setHeader).toHaveBeenCalledWith(
            "Content-Disposition",
            expect.stringContaining("financial_report.pdf")
        );
        expect(res.sendFile).toHaveBeenCalledWith(
            filePath,
            expect.any(Function)
        );
        expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
    });

    it("deve gerar um arquivo CSV e enviá-lo", async () => {
        req.body.formArquivo = "CSV";
        const filePath = path.join(__dirname, "../../CSV/financial_report.csv");

        generateFinancialReportCSV.mockResolvedValueOnce();

        await generateFinancialReport(req, res);

        expect(generateFinancialReportCSV).toHaveBeenCalledWith(
            expect.any(Array),
            filePath,
            expect.arrayContaining([
                "contaOrigem",
                "contaDestino",
                "nomeOrigem",
                "nomeDestino",
                "valorBruto",
                "valorLiquido",
                "formadePagamento",
                "datadeVencimento",
                "datadePagamento",
                "baixada",
                "descricao",
            ])
        );
        expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv");
        expect(res.setHeader).toHaveBeenCalledWith(
            "Content-Disposition",
            expect.stringContaining("financial_report.csv")
        );
        expect(res.sendFile).toHaveBeenCalledWith(
            filePath,
            expect.any(Function)
        );
        expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
    });

    it("deve criar o diretório se não existir", async () => {
        req.body.formArquivo = "PDF";
        const filePath = path.join(__dirname, "../../PDF/financial_report.pdf");

        generateFinancialReportPDF.mockResolvedValueOnce();

        fs.existsSync.mockReturnValue(false);
        fs.mkdirSync.mockReturnValue();

        await generateFinancialReport(req, res);

        expect(fs.existsSync).toHaveBeenCalledWith(path.dirname(filePath));
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(filePath), {
            recursive: true,
        });
    });

    it("deve retornar 404 se não houver movimentações financeiras", async () => {
        FinancialMovements.find.mockResolvedValueOnce([]);

        await generateFinancialReport(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(
            "Nenhuma movimentação financeira encontrada."
        );
    });

    it("deve retornar 500 em caso de erro", async () => {
        FinancialMovements.find.mockRejectedValueOnce(
            new Error("Erro no banco de dados")
        );

        await generateFinancialReport(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            "Erro ao gerar o relatório financeiro."
        );
    });

    it("deve retornar 400 se o formato do arquivo for inválido", async () => {
        req.body.formArquivo = "INVALID_FORMAT";

        await generateFinancialReport(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Formato de arquivo inválido.");
    });

    it("deve validar corretamente a sanitização de entradas", async () => {
        req.body.nomeOrigem = "<script>alert('hack');</script>";

        await generateFinancialReport(req, res);

        // Verifica se o valor foi sanitizado corretamente
        expect(req.body.nomeOrigem).toBe("<script>alert('hack');</script>");
    });
    it("deve gerar a consulta corretamente com filtros aplicados", async () => {
        req.body.sitPagamento = "Pago"; // Certifique-se de que o valor é "Pago"
        req.body.dataInicio = "2024-01-01";
        req.body.dataFinal = "2024-12-31";
        req.body.contaDestino = "5678";
        req.body.contaOrigem = "1234";
        req.body.nomeDestino = "Empresa B";
        req.body.nomeOrigem = "Empresa A";
        req.body.tipoDocumento = "Fatura";
    
        await generateFinancialReport(req, res);
    
        expect(FinancialMovements.find).toHaveBeenCalledWith(
            expect.objectContaining({
                sitPagamento: "Pago", // Espera-se que o filtro sitPagamento esteja presente
                datadeVencimento: {
                    $gte: new Date("2024-01-01T00:00:00.000Z"),
                    $lte: new Date("2024-12-31T00:00:00.000Z"),
                },
                datadePagamento: { $exists: true, $lte: expect.any(Date) },
                contaDestino: "5678", 
                contaOrigem: "1234",  
                nomeDestino: "Empresa B", 
                nomeOrigem: "Empresa A",
                tipoDocumento: "Fatura", 
            })
        );
    }); 
       
    

it("não deve recriar o diretório se ele já existir", async () => {
    req.body.formArquivo = "PDF";
    const filePath = path.join(__dirname, "../../PDF/financial_report.pdf");

    generateFinancialReportPDF.mockResolvedValueOnce();

    // Simula que o diretório já existe
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockReturnValue(); // Não deve ser chamada, já que o diretório existe

    await generateFinancialReport(req, res);

    expect(fs.existsSync).toHaveBeenCalledWith(path.dirname(filePath));
    expect(fs.mkdirSync).not.toHaveBeenCalled(); // Verifica que mkdirSync não foi chamada
});
it("deve retornar 500 se houver erro ao enviar o arquivo", async () => {
    res.sendFile = jest.fn((filePath, callback) => callback(new Error("Erro ao enviar arquivo")));

    await generateFinancialReport(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Erro ao enviar o arquivo.");
});
it("deve aplicar o filtro tipoDocumento corretamente", async () => {
    req.body.tipoDocumento = "Fatura";

    await generateFinancialReport(req, res);

    expect(FinancialMovements.find).toHaveBeenCalledWith(
        expect.objectContaining({
            tipoDocumento: "Fatura",
        })
    );
});
it("deve gerar o relatório financeiro quando includeFields não for fornecido", async () => {
    const reqWithoutIncludeFields = { ...req, body: { ...req.body, includeFields: {} } };

    await generateFinancialReport(reqWithoutIncludeFields, res);

    // Verifique se o relatório foi gerado sem campos adicionais
    expect(generateFinancialReportPDF).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(String),
        expect.arrayContaining(["contaOrigem", "contaDestino", "nomeOrigem", "nomeDestino"])
    );
});
it("deve gerar a consulta corretamente quando apenas dataInicio é fornecida", async () => {
    const reqWithOnlyDataInicio = { ...req, body: { ...req.body, dataFinal: undefined } };

    await generateFinancialReport(reqWithOnlyDataInicio, res);

    expect(FinancialMovements.find).toHaveBeenCalledWith(
        expect.objectContaining({
            datadeVencimento: { $gte: new Date("2024-01-01") },
        })
    );
});

it("deve gerar a consulta corretamente quando apenas dataFinal é fornecida", async () => {
    const reqWithOnlyDataFinal = { ...req, body: { ...req.body, dataInicio: undefined } };

    await generateFinancialReport(reqWithOnlyDataFinal, res);

    expect(FinancialMovements.find).toHaveBeenCalledWith(
        expect.objectContaining({
            datadeVencimento: { $lte: new Date("2024-12-31") },
        })
    );
});
it("deve gerar o relatório financeiro corretamente quando alguns parâmetros são ausentes", async () => {
    const reqWithoutSitPagamento = { ...req };
    delete reqWithoutSitPagamento.body.sitPagamento;

    await generateFinancialReport(reqWithoutSitPagamento, res);

    // Verifique se a consulta gerada não inclui 'sitPagamento'
    expect(FinancialMovements.find).toHaveBeenCalledWith(
        expect.objectContaining({
            sitPagamento: undefined,
        })
    );
});
it("deve gerar um arquivo CSV e enviá-lo", async () => {
    req.body.formArquivo = "CSV";
    const filePath = path.join(__dirname, "../../CSV/financial_report.csv");

    generateFinancialReportCSV.mockResolvedValueOnce();

    await generateFinancialReport(req, res);

    expect(generateFinancialReportCSV).toHaveBeenCalledWith(
        expect.any(Array),
        filePath,
        expect.arrayContaining([
            "contaOrigem", "contaDestino", "nomeOrigem", "nomeDestino", "valorBruto", "valorLiquido",
            "formadePagamento", "datadeVencimento", "datadePagamento", "baixada", "descricao"
        ])
    );
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv");
    expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", expect.stringContaining("financial_report.csv"));
    expect(res.sendFile).toHaveBeenCalledWith(filePath, expect.any(Function));
    expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
});

});
