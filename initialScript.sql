CREATE TABLE veiculo (
    id SERIAL PRIMARY KEY, -- Identificador único para o veículo
    placa VARCHAR(10) NOT NULL UNIQUE, -- Placa do veículo
    chassi VARCHAR(17) NOT NULL, -- Chassi do veículo
    renavam VARCHAR(12) NOT NULL, -- RENAVAM do veículo
    marca_modelo VARCHAR(100), -- Marca e modelo do veículo
    ano_fabricacao VARCHAR(4), -- Ano de fabricação do veículo
    ano_modelo VARCHAR(4), -- Ano do modelo do veículo
    cor VARCHAR(50), -- Cor do veículo
    uf VARCHAR(2), -- Estado (UF) do veículo
    cpf_cnpj VARCHAR(14), -- CPF ou CNPJ do proprietário
    created_at TIMESTAMP DEFAULT NOW(), -- Data de criação do registro
    updated_at TIMESTAMP DEFAULT NULL -- Data de última atualização
);

CREATE TABLE pedido (
    id SERIAL PRIMARY KEY, -- Identificador único para o pedido
    veiculo_id INT NOT NULL REFERENCES veiculo(id) ON DELETE CASCADE, -- Relaciona com a tabela veiculos
    pedido INT NOT NULL, -- Número do pedido
    mensagem TEXT, -- Mensagem associada ao pedido
    created_at TIMESTAMP DEFAULT NOW(), -- Data de criação do registro
    updated_at TIMESTAMP DEFAULT NULL -- Data de última atualização, inicia como NULL
);

CREATE TABLE debito (
    id SERIAL PRIMARY KEY, -- Identificador único do débito
    pedido_id INT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE, -- Relaciona com a tabela pedidos
    cod_fatura INT NOT NULL, -- Código único da fatura
    vencimento TIMESTAMP, -- Data de vencimento do débito
    status_debito VARCHAR(50), -- Status do débito (ex.: "Vencido", "Pago")
    valor NUMERIC(10, 2), -- Valor do débito
    descricao TEXT, -- Descrição do débito
    created_at TIMESTAMP DEFAULT NOW(), -- Data de criação do registro
    updated_at TIMESTAMP DEFAULT NULL -- Data de última atualização, inicia como NULL
);
