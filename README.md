# Coinvert
![Captura de Tela (90)](https://github.com/user-attachments/assets/879e7c56-10a9-4ddb-be6b-c0f8e9bf7ae3)


Projeto de um sistema que realiza a conversão em tempo real de valores monetários utilizando APIs que contém as bandeiras e o nome das moedas, assim como os valores das mesmas.

## Funcionalidades

### 1. Conversão de Moedas
O projeto permite ao usuário inserir um valor em uma moeda e convertê-lo para outra moeda.

**Moeda de origem**:
  - Um campo de seleção permite ao usuário escolher a moeda de origem entre várias opções, como BRL (Real Brasileiro), EUR (Euro), USD (Dólar Americano), entre outras.
    
   ![Captura de Tela (91)](https://github.com/user-attachments/assets/87ee3fe7-0962-457f-aa6d-393c518c725c)


**Moeda de destino**:
  - Outro campo de seleção de moeda permite ao usuário escolher a moeda de destino.

    ![Captura de Tela (92)](https://github.com/user-attachments/assets/4b5f53d8-6cb1-4586-b1f8-6800028891e7)



  - Um campo de entrada de texto para o usuário digitar o valor a ser convertido.
  - Uma imagem de bandeira da moeda selecionada é exibida ao lado.

![Captura de Tela (93)](https://github.com/user-attachments/assets/f57d3894-5de6-4b26-a3e8-e18b9cf8ee61)

    

**Resultado da Conversão**
 - Abaixo dos campos de entrada e saída, existe uma área dedicada para mostrar o resultado da conversão de moedas.

### 2. Troca de Moedas
Ao clicar no ícone de conversão, os campos de seleção de moeda de origem e destino trocam de posição, facilitando a alteração das moedas.

![Captura de Tela (94)](https://github.com/user-attachments/assets/b9b62d78-60e5-44fb-922b-91ddcaca0071)


### 3. Estatísticas e Botões
- **Limpar**: Um botão que permite limpar os campos de entrada e resetar os valores.
- **Converter**: Um botão que ativa a lógica de conversão quando pressionado, calculando e exibindo o valor convertido.


### 4. Gráficos
- Há uma área com gráficos que exibem barras representando dados históricos ou comparações de câmbio de moedas.
- Cada barra inclui:Um valor, uma barra gráfica, adata associada à barra.

  ![Captura de Tela (93)](https://github.com/user-attachments/assets/fc1b5d74-1c1f-4e8b-9bc0-e5af9a2c7042)


## 🚀 Começando

Clone o repositório em sua máquina local:

```
bash
```

```
git clone https://github.com/nicolaszk/AGES_sprint2

```
ou

```
No GitHub, navegue até o repositório, click em "Code" e depois "Download ZIP".
```

Abra o VSCode, escolha a pasta que foi clonada ou copiada, abra o arquivo index.html em um navegador ou utilize a extensão "Live server".


## ⚙️ Como Usar

1. Selecione a moeda de origem no primeiro campo de seleção.
2. Insira o valor a ser convertido.
3. Selecione a moeda de destino no segundo campo de seleção.
4. Clique no botão **Converter** para exibir o valor convertido.
5. Utilize o botão de troca para inverter as moedas de origem e destino.
6. Veja os gráficos para acompanhar a evolução histórica das taxas de câmbio.
7. Para resetar, clicar no botão **Limpar**.


## 🛠️ Tecnologias Utilizadas

- HTML
- CSS
- JavaScript
