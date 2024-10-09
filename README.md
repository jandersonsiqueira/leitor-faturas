```markdown
# Leitor de Faturas - Dashboard

Este projeto é um dashboard desenvolvido em React, que exibe informações de consumo de energia e valores de faturas para diferentes clientes. Os dados são visualizados por meio de gráficos de barra, utilizando `react-chartjs-2` e `chart.js`.

## Funcionalidades

- Buscar e exibir faturas de energia com base no `cliente_id`.
- Visualizar gráficos de consumo de energia elétrica e energia compensada.
- Visualizar gráficos de valores totais e economia com geração distribuída (GD).
- Pesquisa de faturas por cliente utilizando um seletor ou inserção manual de ID.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construir a interface.
- **Chart.js**: Para renderização dos gráficos.
- **Axios**: Para requisições HTTP.
- **Node.js**: Back-end para prover a API de faturas.
- **CSS3**: Estilização da aplicação.

## Requisitos

- **Node.js** (v14 ou superior)
- **npm** (v6 ou superior)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/leitor-faturas.git
cd leitor-faturas
```

2. Instale as dependências:

```bash
npm install
```

3. Inicialize o servidor de desenvolvimento:

```bash
npm start
```

4. Acesse a aplicação no navegador em [http://localhost:3000](http://localhost:3000).

## API de Faturas

O projeto faz requisições para um back-end local que deve estar rodando na porta `4000`. Certifique-se de que o back-end esteja configurado corretamente para fornecer os dados das faturas.

### Exemplo de Requisição

A aplicação faz uma requisição `GET` para a API de faturas:

```bash
GET http://localhost:4000/api/faturas
```

Parâmetro opcional para buscar por cliente específico:

```bash
GET http://localhost:4000/api/faturas?clienteId=<cliente_id>
```

## Scripts

- `npm start`: Inicia o servidor de desenvolvimento.
- `npm test`: Executa testes unitários (veja a seção sobre testes).
- `npm run build`: Gera a versão de produção do projeto.

## Testes

Testes unitários são feitos utilizando o **Testing Library** para React. Para rodar os testes, utilize o comando:

```bash
npm test
```

Certifique-se de que o `@testing-library/react` e o `@testing-library/jest-dom` estejam instalados corretamente.

## Estilização

A aplicação foi estilizada com um arquivo CSS simples para manter uma aparência limpa e profissional. A área de pesquisa por cliente foi estilizada de forma responsiva e com atenção à usabilidade.

## Contribuição

Se você quiser contribuir para este projeto, siga as etapas abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature ou correção: `git checkout -b minha-feature`.
3. Faça commit das suas alterações: `git commit -m 'Adicionei nova feature'`.
4. Envie para a branch principal: `git push origin minha-feature`.
5. Abra um Pull Request.

```
