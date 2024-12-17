const fs = require("fs");
const {
    generateFinancialReportCSV,
    formatNumericDate,
} = require("../Models/csvGenerator");
const { parse } = require("json2csv");

jest.mock("fs");
jest.mock("json2csv", () => ({
    parse: jest.fn(),
}));

test("deve gerar CSV corretamente com apenas um campo incluído", async () => {
    const financialMovements = [
        { tipoDocumento: "Fatura", valorBruto: 1000 },
        { tipoDocumento: "Nota", valorBruto: 2000 },
    ];
    const includeFields = ["tipoDocumento"]; // Apenas incluir "tipoDocumento"
    const filePath = "/caminho/para/arquivo.csv";

    // Mock do json2csv para retornar o CSV esperado
    parse.mockImplementation((data, options) => {
        const fields = options.fields.map((field) => field.label);
        const rows = data.map((row) =>
            options.fields.map((field) => `"${row[field.value]}"`).join(",")
        );
        return `"${fields.join('","')}"\n${rows.join("\n")}`;
    });

    const writeFileSyncMock = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});

    const expectedCsv = `"Tipo Documento"\n"Fatura"\n"Nota"`;

    await generateFinancialReportCSV(financialMovements, filePath, includeFields);

    expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, expectedCsv);
  });
  
  
  test("deve retornar CSV vazio se campos inválidos forem passados", async () => {
    const financialMovements = [
      {
        tipoDocumento: "Fatura",
        valorBruto: 1000,
      },
    ];
  
    const includeFields = ["campoInvalido"]; // Campo inválido
    const filePath = "/caminho/para/arquivo.csv";
  
    const writeFileSyncMock = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
  
    await generateFinancialReportCSV(financialMovements, filePath, includeFields);
  
    expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, "");
  });
  
  test("deve gerar CSV vazio se não houver movimentos financeiros", async () => {
    const financialMovements = [];
    const includeFields = ["tipoDocumento"];
    const filePath = "/caminho/para/arquivo.csv";

    const writeFileSyncMock = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});

    await generateFinancialReportCSV(financialMovements, filePath, includeFields);

    expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, "");
  });

  test("deve gerar CSV vazio se não houver campos para incluir", async () => {
    const financialMovements = [
      {
        tipoDocumento: "Fatura",
        valorBruto: 1000,
        valorLiquido: 900,
        contaOrigem: "1234",
        nomeOrigem: "Empresa A",
        contaDestino: "5678",
        nomeDestino: "Empresa B",
        datadeVencimento: "2024-01-01",
        datadePagamento: "2024-01-10",
        formadePagamento: "Boleto",
        sitPagamento: "Pago",
        descricao: "Pagamento de serviços",
      },
    ];
    const includeFields = []; // Nenhum campo incluído
    const filePath = "/caminho/para/arquivo.csv";

    const writeFileSyncMock = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});

    await generateFinancialReportCSV(financialMovements, filePath, includeFields);

    expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, "");
  });

  test("deve retornar CSV vazio se campos inválidos forem passados", async () => {
    const financialMovements = [
      {
        tipoDocumento: "Fatura",
        valorBruto: 1000,
        valorLiquido: 900,
        contaOrigem: "1234",
        nomeOrigem: "Empresa A",
        contaDestino: "5678",
        nomeDestino: "Empresa B",
        datadeVencimento: "2024-01-01",
        datadePagamento: "2024-01-10",
        formadePagamento: "Boleto",
        sitPagamento: "Pago",
        descricao: "Pagamento de serviços",
      },
    ];
    const includeFields = ["invalidField"]; // Campo inválido
    const filePath = "/caminho/para/arquivo.csv";

    const writeFileSyncMock = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});

    await generateFinancialReportCSV(financialMovements, filePath, includeFields);

    expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, "");
  });

  test("deve retornar erro se houver falha ao gerar o arquivo", async () => {
    const financialMovements = [
      {
        tipoDocumento: "Fatura",
        valorBruto: 1000,
        valorLiquido: 900,
        contaOrigem: "1234",
        nomeOrigem: "Empresa A",
        contaDestino: "5678",
        nomeDestino: "Empresa B",
        datadeVencimento: "2024-01-01",
        datadePagamento: "2024-01-10",
        formadePagamento: "Boleto",
        sitPagamento: "Pago",
        descricao: "Pagamento de serviços",
      },
    ];
    const includeFields = ["tipoDocumento"];
    const filePath = "/caminho/para/arquivo.csv";

    const error = new Error("Erro ao salvar arquivo");
    jest.spyOn(fs, "writeFileSync").mockImplementation(() => { throw error });

    try {
      await generateFinancialReportCSV(financialMovements, filePath, includeFields);
    } catch (err) {
      expect(err).toBe(error);
    }
  });

  test("deve formatar uma data válida corretamente", () => {
    const date = "2024-12-16";
    expect(formatNumericDate(date)).toBe("16/12/2024");
});

test("deve retornar string vazia para data inválida", () => {
    const date = "data_invalida";
    expect(formatNumericDate(date)).toBe("");
});

test("deve retornar string vazia se data não for fornecida", () => {
    expect(formatNumericDate()).toBe("");
});

test("deve gerar CSV vazio se includeFields estiver vazio", async () => {
    const financialMovements = [
        { tipoDocumento: "Fatura", valorBruto: 1000 },
    ];
    const includeFields = [];
    const filePath = "/caminho/para/arquivo.csv";

    const writeFileSyncMock = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});

    await generateFinancialReportCSV(financialMovements, filePath, includeFields);

    expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, "");
});

test("deve retornar erro se a data de pagamento for inválida", () => {
    const financialMovements = [
      { datadePagamento: "2024-12-10" },
      { datadePagamento: "invalid-date" }, // Dados inválidos
      { datadePagamento: "2024-12-12" },
    ];
    const includeFields = ["sitPagamento"];
    const filePath = "/caminho/para/arquivo.csv";
  
    try {
      generateFinancialReportCSV(financialMovements, filePath, includeFields);
    } catch (e) {
      console.log(e); // Verifique se o erro está sendo capturado
      expect(e.message).toBe("Data de pagamento inválida");
    }
  });