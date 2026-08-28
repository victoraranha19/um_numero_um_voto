import { Typography } from '@mui/material';

export default function RegrasPage() {
  return (
    <>
      <Typography>Regulamento e Termos do Sorteio</Typography>
      <Typography>1. Origem dos Números Oficiais (Loteria Federal)</Typography>
      <Typography>
        Para a apuração do prêmio principal, a campanha utiliza os resultados da
        Loteria Federal divulgados publicamente pela Caixa Econômica Federal. O
        sorteio oficial fornece os números do 1º ao 5º prêmio, os quais são
        capturados automaticamente pelo sistema e utilizados como base para a
        combinação do número contemplado.
      </Typography>
      <Typography>
        2. Formação do Número Base do Prêmio Principal (Cota Combinação de 10
        Números)
      </Typography>
      <Typography>
        Ao contrário da apuração tradicional por bilhete único ou terminação, o
        Número da Sorte Contemplado (composto por 10 dígitos) é formado pela
        combinação das duas primeiras colunas (primeiro e segundo dígitos) de
        cada um dos 5 prêmios da Loteria Federal, organizados de forma
        sequencial do 1º ao 5º prêmio:
      </Typography>
      <Typography>
        2.1. Primeira parte (5 dígitos): pega-se o 1º dígito (primeira coluna)
        do 1º, 2º, 3º, 4º e 5º prêmio.
      </Typography>
      <Typography>
        2.2. Segunda parte (5 dígitos): pega-se o 2º dígito (segunda coluna) do
        1º, 2º, 3º, 4º e 5º prêmio.
      </Typography>
      <Typography>
        2.3. O número final sorteado é a junção perfeita dessas duas partes,
        resultando em uma cota de 10 dígitos.
      </Typography>
      <Typography>Exemplo Prático de Formação do Número:</Typography>
      <Typography>
        Suponha que os resultados oficiais da Loteria Federal sejam:
      </Typography>
      <Typography>1º Prêmio: 1 6 1 0 2</Typography>
      <Typography>2º Prêmio: 2 7 3 2 2</Typography>
      <Typography>3º Prêmio: 3 8 5 4 2</Typography>
      <Typography>4º Prêmio: 4 9 7 6 2</Typography>
      <Typography>5º Prêmio: 5 0 9 8 2</Typography>
      <Typography>
        Colhendo a 1ª coluna (1ºs dígitos): 1 - 2 - 3 - 4 - 5
      </Typography>
      <Typography>
        Colhendo a 2ª coluna (2ºs dígitos): 6 - 7 - 8 - 9 - 0
      </Typography>
      <Typography>Número Base Sorteado (10 dígitos): 1234567890</Typography>
      <Typography>
        O participante que possuir a cota correspondente ao número formado
        (1234567890) será o ganhador do prêmio principal.
      </Typography>
      <Typography>3. Premiação Instantânea (Cotas Premiadas)</Typography>
      <Typography>
        Além do prêmio principal apurado pela Loteria Federal, a campanha conta
        com Prêmios Instantâneos (Cotas Premiadas) no valor de R$ 1.000,00 cada.
      </Typography>
      <Typography>
        Como funciona: As cotas com números repetidos/especiais listados abaixo
        já estão cadastradas e ocultas no sistema:
      </Typography>
      <Typography>9.999.999.999</Typography>
      <Typography>8.888.888.888</Typography>
      <Typography>7.777.777.777</Typography>
      <Typography>6.666.666.666</Typography>
      <Typography>5.555.555.555</Typography>
      <Typography>4.444.444.444</Typography>
      <Typography>3.333.333.333</Typography>
      <Typography>2.222.222.222</Typography>
      <Typography>1.111.111.111</Typography>
      <Typography>
        Contemplação: Comprou, ganhou na hora! Se ao gerar seus bilhetes você
        adquirir qualquer uma dessas cotas repetidas, o prêmio instantâneo de R$
        1.000,00 é ativado automaticamente no momento da confirmação do
        pagamento.
      </Typography>
      <Typography>4. Data do Sorteio e Adiamentos</Typography>
      <Typography>
        A apuração do prêmio principal depende exclusivamente da Extração da
        Loteria Federal na data informada na campanha. Caso a extração da Caixa
        Econômica Federal não ocorra na data prevista (devido a feriados,
        suspensão de sorteios ou outros motivos de força maior), a apuração será
        automaticamente transferida para a Extração da Loteria Federal
        subsequente. A data efetiva da apuração permanecerá gravada no sistema
        junto ao resultado.
      </Typography>
      <Typography>
        5. Identificação do Ganhador e Regra de Aproximação
      </Typography>
      <Typography>
        Apenas bilhetes devidamente pagos e confirmados no sistema até o horário
        limite da campanha são elegíveis.
      </Typography>
      <Typography>
        Correspondência Exata: O sistema compara o número base formado (10
        dígitos) com as cotas vendidas. Havendo correspondência exata, o titular
        do bilhete é o vencedor.
      </Typography>
      <Typography>
        Regra de Aproximação Alternada: Caso o número exato sorteado não tenha
        sido vendido, o sistema aplicará a regra de busca pelo número
        distribuído mais próximo, alternando acima e abaixo em sequência:
      </Typography>
      <Typography>
        1º número superior (+1) $\rightarrow$ 1º número inferior (-1)
        $\rightarrow$ 2º número superior (+2) $\rightarrow$ 2º número inferior
        (-2)... e assim sucessivamente até localizar uma cota vendida e paga.
      </Typography>
      <Typography>6. Regra Circular (Extremos Numéricos)</Typography>
      <Typography>
        A busca de aproximação respeita a totalidade do intervalo numérico (de
        0000000000 a 9999999999).
      </Typography>
      <Typography>
        Após o número 9999999999, o próximo número considerado na busca é
        0000000000.
      </Typography>
      <Typography>
        Antes do número 0000000000, o número anterior considerado é 9999999999.
      </Typography>
      <Typography>7. Critérios para Validação do Prêmio</Typography>
      <Typography>
        Se existir ao menos um bilhete pago na campanha, a regra de aproximação
        garante a definição de um ganhador para o prêmio principal. A apuração
        só será declarada sem vencedor se não houver nenhum bilhete pago em toda
        a campanha.
      </Typography>
      <Typography>8. Transparência e Acompanhamento</Typography>
      <Typography>
        Seus Números: Consulte e busque seus bilhetes a qualquer momento,
        verificando status do pedido de compra (pendente ou pago).
      </Typography>
      <Typography>
        Painel de Ganhadores: Assim que a Caixa divulga o resultado, o sistema
        exibe os números oficiais, a cota contemplada e os dados do ganhador.
      </Typography>
      <Typography>
        Auditoria da Fonte Oficial: Disponibilizamos o link direto para o site
        da Caixa e salvamos a resposta oficial da extração (arquivo JSON com
        chave SHA-256) para conferência independente e à prova de manipulação.
      </Typography>
    </>
  );
}
