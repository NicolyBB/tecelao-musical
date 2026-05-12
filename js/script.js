// ==========================================
// SELECIONANDO OS ELEMENTOS DO HTML
// ==========================================
const bolinha = document.getElementById('bolinhaCaindo');
const alvo = document.getElementById('linhaAlvo');
const modal = document.getElementById('modalPergunta');
const fundo = document.getElementById('fundoRevelacao');
const indicadorVelocidade = document.querySelector('.indicador-velocidade span');

// ==========================================
// VARIÁVEIS DE CONTROLE DO JOGO DE RITMO
// ==========================================
let posicaoY = -70; // Bolinha começa escondida no topo
let velocidade = 2; // Começa no nível LENTO
let animacaoId;
let acertos = 0;
const totalParaRevelar = 5; // Quantas vezes a criança precisa acertar o ritmo para a pergunta aparecer

// ==========================================
// BANCO DE PERGUNTAS (CAIXA ALTA OBRIGATÓRIA)
// ==========================================
// As perguntas e respostas devem estar sempre em MAIÚSCULAS para facilitar a leitura das crianças.
const bancoPerguntas = [
    {
        pergunta: "NA FESTA MAIS ANIMADA DE BRUSQUE, A FENARRECO, A GENTE CANTA E DANÇA IMITANDO QUAL BICHINHO?",
        opcoes: ["O CACHORRINHO 🐶", "O MARRECO (UM TIPO DE PATO) 🦆", "O GATINHO 🐱"],
        correta: 1, // O Marreco é a opção 1 (o índice começa em 0, 1, 2)
        curiosidade: "🎵 A TRADICIONAL DANÇA DO MARRECO É TOCADA COM MÚSICA DE BANDINHA ALEMÃ!"
    },
    {
        pergunta: "QUAL INSTRUMENTO MUSICAL FAZ UM SOM DIVERTIDO PARECIDO COM 'FOM-FOM' NAS FESTAS DA CIDADE?",
        opcoes: ["A SANFONA (GAITA OU ACORDEON) 🪗", "O VIOLÃO 🎸", "A FLAUTA 🪈"],
        correta: 0, // A Sanfona é a opção 0
        curiosidade: "🎵 MÚSICAS TRADICIONAIS DE GAITA TOCAM NOS PAVILHÕES DA FESTA!"
    }
];

// ==========================================
// LÓGICA DE QUEDA DA BOLINHA
// ==========================================
function animarBolinha() {
    posicaoY += velocidade; // A bolinha desce de acordo com a velocidade
    bolinha.style.top = posicaoY + 'px';

    // Pega a posição atual da bolinha na tela
    const rectBolinha = bolinha.getBoundingClientRect();

    // Se a bolinha cair para fora da tela (a criança esqueceu de apertar ou errou)
    if (rectBolinha.top > window.innerHeight) {
        posicaoY = -70; // Volta a bolinha lá pra cima
        velocidade = 2; // Punição leve: O jogo volta pro nível LENTO para acolher a criança
        indicadorVelocidade.innerText = "VELOCIDADE: 🐌 LENTO";
    }

    // Chama a animação repetidamente para criar o movimento fluido
    animacaoId = requestAnimationFrame(animarBolinha);
}

// ==========================================
// IDENTIFICANDO A TECLA 'ESPAÇO' (COMPATÍVEL COM CHROMEBOOKS)
// ==========================================
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // Evita que a página role para baixo ao apertar espaço
        verificarAcerto();
    }
});

// ==========================================
// LÓGICA DE ACERTO NO ALVO E REVELAÇÃO DA IMAGEM
// ==========================================
function verificarAcerto() {
    const rectBolinha = bolinha.getBoundingClientRect();
    const rectAlvo = alvo.getBoundingClientRect();

    // Calcula se a bolinha está "encostando" no alvo. 
    // Foi dada uma margem generosa (para cima e para baixo) pensando na idade de 4 a 5 anos.
    if (rectBolinha.bottom >= rectAlvo.top && rectBolinha.top <= rectAlvo.bottom) {
        
        // ACERTOU!
        posicaoY = -70; // Joga a bolinha para cima de novo
        acertos++;

        // Aumenta a dificuldade (velocidade) aos poucos
        if (velocidade < 5) {
            velocidade += 1.5;
            if (velocidade >= 3.5 && velocidade < 5) {
                indicadorVelocidade.innerText = "VELOCIDADE: 🚶 NORMAL";
            } else if (velocidade >= 5) {
                indicadorVelocidade.innerText = "VELOCIDADE: 🐇 RÁPIDO";
            }
        }

        // Revela a imagem de fundo aos poucos (vai ficando menos transparente)
        // No futuro, podemos trocar isso para montar as peças do seu arquivo TecerImagens.png
        fundo.style.backgroundColor = `rgba(255, 255, 255, ${acertos / totalParaRevelar})`;

        // Se a criança já acertou o alvo vezes suficientes (completou a imagem)
        if (acertos >= totalParaRevelar) {
            cancelAnimationFrame(animacaoId); // Para a bolinha de cair
            bolinha.classList.add('oculto'); // Esconde a bolinha da tela
            mostrarPerguntaModal(); // Abre a janela de pergunta
        }
    }
}

// ==========================================
// EXIBINDO A PERGUNTA (ALEATÓRIA E EM CAIXA ALTA)
// ==========================================
function mostrarPerguntaModal() {
    modal.classList.remove('oculto'); // Faz o modal aparecer no CSS

    // Sorteia uma pergunta aleatória do nosso banco, atendendo ao feedback dos avaliadores
    const indiceSorteado = Math.floor(Math.random() * bancoPerguntas.length);
    const perguntaAtual = bancoPerguntas[indiceSorteado];

    // Atualiza o texto da pergunta no HTML
    document.querySelector('.texto-pergunta').innerText = perguntaAtual.pergunta;

    // Atualiza os textos dos botões de resposta
    const botoes = document.querySelectorAll('.btn-resposta');
    botoes.innerText = perguntaAtual.opcoes;
    botoes[7].innerText = perguntaAtual.opcoes[7];
    botoes[3].innerText = perguntaAtual.opcoes[3];

    // (Aqui depois adicionaremos a lógica de clique nos botões para ver se a criança acertou a pergunta)
}

// INICIA O JOGO ASSIM QUE A PÁGINA CARREGA
animarBolinha();