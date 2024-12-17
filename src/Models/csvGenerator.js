const fs = require("fs");
const { parse } = require("json2csv");

const formatNumericDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return ""; // Retorna string vazia se a data for inválida
    }
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const generateFinancialReportCSV = (financialMovements, filePath, includeFields) => {
    return new Promise((resolve, reject) => {
        try {
            if (financialMovements.length === 0) {
                fs.writeFileSync(filePath, "");
                return resolve();
            }

            const allFields = {
                tipoDocumento: { label: "Tipo Documento", value: "tipoDocumento" },
                valorBruto: { label: "Valor Bruto", value: "valorBruto" },
                valorLiquido: { label: "Valor Líquido", value: "valorLiquido" },
                contaOrigem: { label: "Conta Origem", value: "contaOrigem" },
                nomeOrigem: { label: "Nome Origem", value: "nomeOrigem" },
                contaDestino: { label: "Conta Destino", value: "contaDestino" },
                nomeDestino: { label: "Nome Destino", value: "nomeDestino" },
                dataVencimento: {
                    label: "Data de Vencimento",
                    value: (row) => formatNumericDate(row.datadeVencimento),
                },
                dataPagamento: {
                    label: "Data de Pagamento",
                    value: (row) => formatNumericDate(row.datadePagamento),
                },
                formaPagamento: { label: "Forma de Pagamento", value: "formaPagamento" },
                sitPagamento: {
                    label: "Situação de Pagamento",
                    value: (row) => {
                        // Verificar se a linha ou o campo de data está ausente ou inválido
                        if (!row || row.datadePagamento == null) {
                            console.log("Linha sem data de pagamento:", row); // Log para debugar
                            return "Não pago";  // Retorna 'Não pago' se não houver data
                        }
                
                        // Verificar se a data é válida
                        const paymentDate = new Date(row.datadePagamento);
                        if (isNaN(paymentDate.getTime())) {
                            console.log("Data inválida:", row.datadePagamento); // Log para debugar
                            return "Não pago";  // Retorna 'Não pago' se a data for inválida
                        }
                
                        const today = new Date();
                        return paymentDate <= today ? "Pago" : "Não pago";
                    },
                },
                
                descricao: { label: "Descrição", value: "descricao" },
            };
            
            if (!includeFields || includeFields.length === 0) {
                fs.writeFileSync(filePath, "");
                return resolve();
            }

            const fields = includeFields.map((field) => allFields[field]).filter(Boolean);

            if (fields.length === 0) {
                fs.writeFileSync(filePath, "");
                return resolve();
            }

            const csv = parse(financialMovements, { fields });

            console.log("Campos incluídos:", fields);
            console.log("CSV gerado:", csv);

            fs.writeFileSync(filePath, csv);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateFinancialReportCSV, formatNumericDate };
