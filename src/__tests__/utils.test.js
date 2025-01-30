const { validator } = require("../Util/utils");
const jwt = require("jsonwebtoken");
require("dotenv").config();

mockedToken = () =>{
    let jwtTemp =  {
            "id": "6783471ed9b501ccc074f977",
            "_id": "6783471ed9b501ccc074f96a",
            "name": "administrador",
            "permissions": [
                "perfis_editar",
                "perfis_deletar",
                "perfis_visualizar",
                "orgaos_criar",
                "orgaos_editar",
                "orgaos_deletar",
                "orgaos_visualizar",
                "fornecedores_criar",
                "fornecedores_editar",
                "fornecedores_deletar",
                "fornecedores_visualizar",
                "contas_bancarias_criar",
                "contas_bancarias_editar",
                "contas_bancarias_deletar",
                "contas_bancarias_visualizar",
                "movimentacao_financeira_criar",
                "movimentacao_financeira_editar",
                "movimentacao_financeira_deletar",
                "movimentacao_financeira_visualizar",
                "permissoes_criar",
                "permissoes_editar",
                "permissoes_deletar",
                "permissoes_visualizar",
                "beneficios_criar",
                "beneficios_visualizar",
                "beneficios_editar",
                "beneficios_deletar",
                "usuarios_visualizar",
                "usuarios_editar",
                "usuarios_deletar",
                "usuarios_criar",
                "create",
                "read",
                "update",
                "delete",
                "usuarios_visualizar_historico\t",
                "associados_criar",
                "associados_deletar",
                "associados_editar",
                "associados_visualizar",
                "perfis_criar",
                "filiados_cadastrar",
                "usuarios_visualizar_historico",
                "sindicalizado_visualizar_status",
                "filiado_visualizar_carteirinha"
            ]
        ,
        "user": {
            "situation": "",
            "description": "",
            "_id": "6783471ed9b501ccc074f977",
            "name": "Admin",
            "email": "admin@admin.com",
            "phone": "1234567890",
            "role": "6783471ed9b501ccc074f96a",
            "status": true,
            "isProtected": true,
            "createdAt": "2025-01-12T04:37:50.966Z",
            "updatedAt": "2025-01-12T04:37:50.966Z",
            "__v": 0
        },
    }
    const token = jwt.sign(jwtTemp, 'S3T1N3L3L4', {
        expiresIn: "30d",
    }); 
    return token.trim();
}

describe("Supplier Data Validator", () => {
    it("should return an error for invalid nome", () => {
        const result = validator({ nome: "" });
        expect(result).toBe("Nome ou Razão social inválidos");
    });

    it("should return an error for invalid tipoPessoa", () => {
        const result = validator({ nome: "Valid Name", tipoPessoa: "Invalid" });
        expect(result).toBe("Tipo de pessoa inválida");
    });

    it("should return an error for invalid CPF", () => {
        const result = validator({
            nome: "Valid Name",
            tipoPessoa: "Jurídica",
            cpfCnpj: "123.456.789-10",
        });
        expect(result).toBe("CPF ou CNPJ inválido");
    });

    it("should return an error for invalid CNPJ", () => {
        const result = validator({
            nome: "Valid Name",
            tipoPessoa: "Física",
            cpfCnpj: "12.345.678/0001-99",
        });
        expect(result).toBe("CPF ou CNPJ inválido");
    });

    it("should return an error for invalid statusFornecedor", () => {
        const result = validator({
            nome: "Valid Name",
            statusFornecedor: "Invalid",
        });
        expect(result).toBe("Status de fornecedor inválido");
    });

    it("should return an error for invalid naturezaTransacao", () => {
        const result = validator({
            nome: "Valid Name",
            naturezaTransacao: "Invalid",
        });
        expect(result).toBe("Tipo de transação inválida");
    });

    it("should return an error for invalid email", () => {
        const result = validator({ nome: "Valid Name", email: "invalidemail" });
        expect(result).toBe("E-mail inválido");
    });

    it("should return an error for invalid nomeContato", () => {
        const result = validator({ nome: "Valid Name", nomeContato: 12345 });
        expect(result).toBe("Nome de contato inválido");
    });

    it("should return an error for invalid celular", () => {
        const result = validator({ nome: "Valid Name", celular: "1234567890" });
        expect(result).toBe("Número de celular inválido");
    });

    it("should return an error for invalid telefone", () => {
        const result = validator({ nome: "Valid Name", telefone: "12345678" });
        expect(result).toBe("Número de telefone inválido");
    });

    it("should return an error for invalid cep", () => {
        const result = validator({ nome: "Valid Name", cep: "12345-6789" });
        expect(result).toBe("Cep inválido");
    });

    it("should return an error for invalid cidade", () => {
        const result = validator({ nome: "Valid Name", cidade: 12345 });
        expect(result).toBe("Cidade inválida");
    });

    it("should return an error for invalid uf_endereco", () => {
        const result = validator({ nome: "Valid Name", uf_endereco: "XX" });
        expect(result).toBe("UF inválida");
    });

    it("should return an error for invalid logradouro", () => {
        const result = validator({ nome: "Valid Name", logradouro: "123" });
        expect(result).toBe(
            "Logradouro inválido. Deve conter entre 5 e 100 caracteres."
        );
    });

    it("should return an error for invalid complemento", () => {
        const result = validator({ nome: "Valid Name", complemento: 12345 });
        expect(result).toBe("Complemento inválido");
    });

    it("should return an error for invalid agencia", () => {
        const result = validator({ nome: "Valid Name", agencia: 12345 });
        expect(result).toBe("Agência inválida");
    });

    it("should return an error for invalid numeroBanco", () => {
        const result = validator({ nome: "Valid Name", numeroBanco: "ABC" });
        expect(result).toBe("Número inválido");
    });

    it("should return an error for invalid dv", () => {
        const result = validator({ nome: "Valid Name", dv: "ABC" });
        expect(result).toBe("DV inválido");
    });

    it("should return an error for invalid chavePix", () => {
        const result = validator({ nome: "Valid Name", chavePix: 12345 });
        expect(result).toBe("Chave Pix inválida");
    });

    it("should return null for valid data", () => {
        const result = validator({
            nome: "Valid Name",
            tipoPessoa: "Física",
            cpfCnpj: "123.456.789-10",
            statusFornecedor: "Ativo",
            naturezaTransacao: "Receita",
            email: "valid@example.com",
            nomeContato: "Valid Contact",
            celular: "(12) 34567-8910",
            telefone: "(12) 3456-7890",
            cep: "12345-678",
            cidade: "Valid City",
            uf_endereco: "SP",
            logradouro: "Rua dos Validos, 123",
            complemento: "Apto 45",
            agencia: "1234",
            numeroBanco: "5678",
            dv: "9",
            chavePix: "validpixkey",
        });
        expect(result).toBeNull();
    });
});
module.exports = { mockedToken }