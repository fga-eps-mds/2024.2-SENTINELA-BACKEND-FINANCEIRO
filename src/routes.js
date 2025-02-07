const express = require("express");
const routes = express.Router();
const bankAccountController = require("./Controllers/bankAccountController");
const supplierFormController = require("./Controllers/supplierFormController");
const financialMovementsController = require("./Controllers/financialMovementsController");
const patrimonioController = require("./Controllers/patrimonioController");
const financialReportController = require("./Controllers/financialReportController");
const patrimonioLocalizacaoController = require("./Controllers/patrimonioLocalizacaoController")
const LocalizacaoController = require("./Controllers/LocalizacaoController")
const { checkPermissions } = require("./Middlewares/accessControlMiddleware");

// Rotas Contas Bancárias
routes.post(
    "/finance/createBankAccount",
    checkPermissions("contas_bancarias_criar"),
    bankAccountController.createBankAccount
);
routes.get(
    "/finance/bankAccount/:id",
    checkPermissions("contas_bancarias_visualizar"),
    bankAccountController.getBankAccountbyId
);
routes.delete(
    "/finance/deleteBankAccount/:id",
    checkPermissions("contas_bancarias_deletar"),
    bankAccountController.deleteBankAccount
);
routes.patch(
    "/finance/updateBankAccount/:id",
    checkPermissions("contas_bancarias_editar"),
    bankAccountController.updateBankAccount
);
routes.get(
    "/finance/getBankAccount",
    checkPermissions("contas_bancarias_visualizar"),
    bankAccountController.getAll
);

// Rotas Fornecedores
routes.post(
    "/SupplierForm/create",
    checkPermissions("fornecedores_criar"),
    supplierFormController.createSupplierForm
);
routes.get(
    "/SupplierForm",
    checkPermissions("fornecedores_visualizar"),
    supplierFormController.getSupplierForm
);
routes.get(
    "/SupplierForm/:id",
    checkPermissions("fornecedores_visualizar"),
    supplierFormController.getSupplierFormById
);
routes.delete(
    "/SupplierForm/delete/:id",
    checkPermissions("fornecedores_deletar"),
    supplierFormController.deleteSupplierFormById
);
routes.patch(
    "/SupplierForm/update/:id",
    checkPermissions("fornecedores_editar"),
    supplierFormController.updateSupplierFormById
);

// Rotas Movimentações Financeiras
routes.post(
    "/financialMovements/create",
    checkPermissions("movimentacao_financeira_criar"),
    financialMovementsController.createFinancialMovements
);
routes.get(
    "/financialMovements",
    checkPermissions("movimentacao_financeira_visualizar"),
    financialMovementsController.getFinancialMovements
);
routes.get(
    "/financialMovements/:id",
    checkPermissions("movimentacao_financeira_visualizar"),
    financialMovementsController.getFinancialMovementsById
);
routes.delete(
    "/financialMovements/delete/:id",
    checkPermissions("movimentacao_financeira_deletar"),
    financialMovementsController.deleteFinancialMovementsById
);
routes.patch(
    "/financialMovements/update/:id",
    checkPermissions("movimentacao_financeira_editar"),
    financialMovementsController.updateFinancialMovementsById
);
routes.post(
    "/financialMovements/report",
    checkPermissions("movimentacao_financeira_visualizar"),
    financialReportController.generateFinancialReport
);
//rotas patrimonio
routes.post(
    "/patrimonio/create",
    checkPermissions("movimentacao_financeira_criar"),
    patrimonioController.createpatrimonio
);
routes.get(
    "/patrimonio",
    checkPermissions("movimentacao_financeira_visualizar"),
    patrimonioController.getpatrimonio
);
routes.get(
    "/patrimonio/:id",
    checkPermissions("movimentacao_financeira_visualizar"),
    patrimonioController.getpatrimonioById
);
routes.delete(
    "/patrimonio/delete/:id",
    checkPermissions("movimentacao_financeira_deletar"),
    patrimonioController.deletepatrimonioById
);
routes.patch(
    "/patrimonio/update/:id",
    checkPermissions("movimentacao_financeira_editar"),
    patrimonioController.updatepatrimonioById
);

routes.post(
    "/patrimonioLocalizacao/create",
    checkPermissions("movimentacao_financeira_criar"),
    patrimonioLocalizacaoController.createpatrimonioLocalizacao
);
routes.get(
    "/patrimonioLocalizacao",
    checkPermissions("movimentacao_financeira_visualizar"),
    patrimonioLocalizacaoController.getpatrimonioLocalizacao
);
routes.get(
    "/patrimonioLocalizacao/:id",
    checkPermissions("movimentacao_financeira_visualizar"),
    patrimonioLocalizacaoController.getpatrimonioLocalizacaoById
);
routes.delete(
    "/patrimonioLocalizacao/delete/:id",
    checkPermissions("movimentacao_financeira_deletar"),
    patrimonioLocalizacaoController.deletepatrimonioLocalizacaoById
);
routes.patch(
    "/patrimonioLocalizacao/update/:id",
    checkPermissions("movimentacao_financeira_editar"),
    patrimonioLocalizacaoController.updatepatrimonioLocalizacaoById
);

routes.post(
    "/localizacao/create",
    checkPermissions("movimentacao_financeira_criar"),
    LocalizacaoController.createlocalizacao
);
routes.get(
    "/localizacao",
    checkPermissions("movimentacao_financeira_visualizar"),
    LocalizacaoController.getlocalizacao
);
routes.get(
    "/localizacao/:id",
    checkPermissions("movimentacao_financeira_visualizar"),
    LocalizacaoController.getlocalizacaoById
);
routes.delete(
    "/localizacao/delete/:id",
    checkPermissions("movimentacao_financeira_deletar"),
    LocalizacaoController.deletelocalizacaoById
);
routes.patch(
    "/localizacao/update/:id",
    checkPermissions("movimentacao_financeira_editar"),
    LocalizacaoController.updatelocalizacaoById
);

module.exports = routes;
