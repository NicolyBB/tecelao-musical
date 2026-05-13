// ==========================================
// SELECIONANDO OS ELEMENTOS DO HTML
// ==========================================
const bolinha = document.getElementById('bolinhaCaindo');
const alvo = document.getElementById('linhaAlvo');
const modal = document.getElementById('modalPergunta');
const fundo = document.getElementById('fundoRevelacao');
const indicadorVelocidade = document.getElementById('txtVelocidade');
const containerOpcoes = document.getElementById('containerOpcoes');
const telaIdentificacao = document.getElementById('telaIdentificacao');
const containerJogo = document.getElementById('containerJogo');
const telaResultado = document.getElementById('telaResultado');

// ==========================================
// VARIÁVEIS DE CONTROLE DO JOGO E PONTUAÇÃO
// ==========================================
let posicaoY = -70; 
let velocidade = 2; 
let animacaoId;
let acertosRitmo = 0;
const totalParaRevelar = 3; // Cliques no ritmo necessários para abrir a pergunta
let perguntaAtualIndex = 0;
let totalAcertosQuiz = 0;
let perguntasEmbaralhadas = [];

// ==========================================
// BANCO DE 15 PERGUNTAS (CONFORME CURRÍCULO DE BRUSQUE)
// REGRA: CAIXA ALTA OBRIGATÓRIA 
// ==========================================
const bancoPerguntas = [
    { p: "NA FESTA DA FENARRECO, A GENTE IMITA QUAL BICHINHO?", opts: ["CACHORRINHO", "MARRECO 🦆", "GATINHO"], corr: 1, cur: "🎵 A DANÇA DO MARRECO É TRADICIONAL EM BRUSQUE!" },
    { p: "QUAL INSTRUMENTO FAZ UM SOM DE 'FOM-FOM'?", opts: ["SANFONA 🪗", "VIOLÃO", "FLAUTA"], corr: 0, cur: "🎵 A SANFONA É MUITO USADA NAS BANDINHAS ALEMÃS!" },
    { p: "QUE ROUPA O FRITZ E A FRIDA USAM PARA DANÇAR?", opts: ["ASTRONAUTA", "PIJAMA", "ROUPINHA ALEMÃ 👗"], corr: 2, cur: "🎵 AS ROUPAS TÍPICAS SÃO LINDAS E COLORIDAS!" },
    { p: "QUE BARULHINHO A MÁQUINA DE TECER FAZ?", opts: ["MIAU MIAU", "TEC-TEC, TIC-TAC 🧵", "PIU-PIU"], corr: 1, cur: "🎵 BRUSQUE É FAMOSA PELOS SEUS TECIDOS!" },
    { p: "O QUE FICA NO ALTO DA IGREJA DE AZAMBUJA E FAZ 'BLEM-BLOM'?", opts: ["O SINO 🔔", "UM AVIÃO", "PASSARINHO"], corr: 0, cur: "🎵 OS SINOS DE AZAMBUJA TOCAM UMA LINDA MÚSICA!" },
    { p: "COMO A GENTE BATE PALMA NA MARCHA ALEMÃ?", opts: ["DEVAGAR", "NO RITMO (UM, DOIS!) 👏", "ESCONDE AS MÃOS"], corr: 1, cur: "🎵 AS PALMAS ACOMPANHAM O RITMO DA BANDA!" },
    { p: "COMO É O SOM QUE O BICO DO MARRECO FAZ?", opts: ["AU AU", "MUUUU", "QUÁ, QUÁ, QUÁ! 🦆"], corr: 2, cur: "🎵 O MARRECO CANTA MUITO NAS FESTAS!" },
    { p: "COMO AS PESSOAS DANÇAM NAS RODAS ALEMÃS?", opts: ["SOZINHAS", "DE MÃOS DADAS 🤝", "DEITADAS"], corr: 1, cur: "🎵 A DANÇA DE RODA UNE TODOS OS AMIGOS!" },
    { p: "QUAL INSTRUMENTO FAZ O SOM 'BUM, BUM, BUM'?", opts: ["TRIÂNGULO", "CHOCALHO", "BUMBO (TAMBOR) 🥁"], corr: 2, cur: "🎵 O BUMBO FAZ A NOSSA BARRIGA TREMER!" },
    { p: "QUAL DOCE GOSTOSO PARECE UM LAÇO OU UM ABRAÇO?", opts: ["PRETZEL 🥨", "SOPA", "ALFACE"], corr: 0, cur: "🎵 O PRETZEL É UM LANCHE TÍPICO MUITO GOSTOSO!" },
    { p: "QUE SOM A ÁGUA DO RIO ITAJAÍ-MIRIM FAZ?", opts: ["VRUMMM", "CHUÁÁ, CHUÁÁ 🌊", "PIII"], corr: 1, cur: "🎵 O SOM DO RIO É A MÚSICA DA NATUREZA!" },
    { p: "QUAIS AS CORES DA BANDEIRA DA ALEMANHA?", opts: ["SÓ BRANCO", "PRETO, VERMELHO E AMARELO 🖤❤️💛", "ROSA"], corr: 1, cur: "🎵 ESSAS CORES ENFEITAM TODA A NOSSA FESTA!" },
    { p: "O QUE OS AVÓS CANTAM PARA OS BEBÊS DORMIREM?", opts: ["ROCK ALTO", "CANTIGAS DE NINAR 👶", "BUZINA"], corr: 1, cur: "🎵 AS CANTIGAS ALEMÃS SÃO MUITO CALMINHAS!" },
    { p: "QUE INSTRUMENTO TEM TECLAS BRANCAS E PRETAS?", opts: ["TECLADO/PIANO 🎹", "PANDEIRO", "BATERIA"], corr: 0, cur: "🎵 O PIANO TOCA MELODIAS MUITO LINDAS!" },
    { p: "O QUE FAZEMOS COM A MÃO QUANDO A FESTA ACABA?", opts: ["DAMOS TCHAU 👋", "DAMOS UM SUSTO", "MÃO NO BOLSO"], corr: 0, cur: "🎵 DIZEMOS 'TSCHÜSS' PARA NOS DESPEDIR!" }
];

// ==========================================
// LÓGICA DE INÍCIO E IDENTIFICAÇÃO (OPCIONAL) 
// ==========================================
function iniciarJogo() {
    const nome = document.getElementById('inputNome').value || "JOGADOR";
    document.getElementById('nomeJogador').innerText = nome.toUpperCase();
    
    telaIdentificacao.classList.add('oculto');
    containerJogo.classList.remove('oculto');
    
    // Embaralha as perguntas para não ser enjoativo 
    perguntasEmbaralhadas = [...bancoPerguntas].sort(() => Math.random() - 0.5);
    
    animarBolinha();
}

// ==========================================
// LÓGICA DE QUEDA DA BOLINHA
// ==========================================
function animarBolinha() {
    posicaoY += velocidade;
    bolinha.style.top = posicaoY + 'px';

    const rectBolinha = bolinha.getBoundingClientRect();

    if (rectBolinha.top > window.innerHeight) {
        posicaoY = -70;
        velocidade = 2; // Volta ao LENTO para acolher a criança
        indicadorVelocidade.innerText = "VELOCIDADE: 🐌 LENTO";
    }

    animacaoId = requestAnimationFrame(animarBolinha);
}

// ==========================================
// IDENTIFICANDO A TECLA 'ESPAÇO' (CHROMEBOOKS)
// ==========================================
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !containerJogo.classList.contains('oculto')) {
        e.preventDefault();
        verificarAcertoRitmo();
    }
});

function verificarAcertoRitmo() {
    const rectBolinha = bolinha.getBoundingClientRect();
    const rectAlvo = alvo.getBoundingClientRect();

    if (rectBolinha.bottom >= rectAlvo.top && rectBolinha.top <= rectAlvo.bottom) {
        posicaoY = -70;
        acertosRitmo++;
        alvo.classList.add('acerto-ritmo');
        setTimeout(() => alvo.classList.remove('acerto-ritmo'), 200);

        // Aumenta velocidade conforme o desempenho 
        if (velocidade < 6) {
            velocidade += 0.8;
            if (velocidade > 4) indicadorVelocidade.innerText = "VELOCIDADE: 🚶 NORMAL";
            if (velocidade > 5.5) indicadorVelocidade.innerText = "VELOCIDADE: 🐇 RÁPIDO";
        }

        if (acertosRitmo >= totalParaRevelar) {
            cancelAnimationFrame(animacaoId);
            mostrarPerguntaModal();
        }
    }
}

// ==========================================
// EXIBINDO A PERGUNTA (ALEATÓRIA E ACESSÍVEL)
// ==========================================
function mostrarPerguntaModal() {
    modal.classList.remove('oculto');
    const q = perguntasEmbaralhadas[perguntaAtualIndex];
    
    document.getElementById('perguntaTexto').innerText = q.p;
    document.getElementById('contadorFase').innerText = `FASE ${perguntaAtualIndex + 1}/15`;
    
    containerOpcoes.innerHTML = "";
    q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = "btn-resposta";
        btn.innerText = opt;
        btn.onclick = () => verificarRespostaQuiz(i === q.corr, q.cur);
        containerOpcoes.appendChild(btn);
    });

    // Suporte por Áudio 
    document.getElementById('btnVoz').onclick = () => {
        const fala = new SpeechSynthesisUtterance(q.p);
        fala.lang = 'pt-BR';
        window.speechSynthesis.speak(fala);
    };
}

// ==========================================
// PROCESSANDO RESPOSTA (SEM FEEDBACK PUNITIVO) 
// ==========================================
function verificarRespostaQuiz(correto, curiosidade) {
    if (correto) totalAcertosQuiz++;
    
    // Esconde opções e mostra curiosidade (Feedback positivo sempre)
    containerOpcoes.classList.add('oculto');
    const feedback = document.getElementById('feedbackResposta');
    feedback.classList.remove('oculto');
    document.getElementById('curiosidadeTexto').innerText = curiosidade;

    document.getElementById('btnProximaFase').onclick = () => {
        feedback.classList.add('oculto');
        containerOpcoes.classList.remove('oculto');
        proximaFase();
    };
}

function proximaFase() {
    perguntaAtualIndex++;
    if (perguntaAtualIndex < 15) {
        modal.classList.add('oculto');
        acertosRitmo = 0;
        posicaoY = -70;
        animarBolinha();
    } else {
        exibirResultadoFinal();
    }
}

// ==========================================
// RESULTADO FINAL LÚDICO
// ==========================================
function exibirResultadoFinal() {
    containerJogo.classList.add('oculto');
    telaResultado.classList.remove('oculto');
    
    const porcentagem = (totalAcertosQuiz / 15) * 100;
    const msg = document.getElementById('mensagemFinal');
    const areaMarreco = document.getElementById('areaMarrecoFinal');

    if (porcentagem >= 90) {
        msg.innerText = "VOCÊ É UM AMIGO DE BRUSQUE! PARABÉNS! 🌟";
        areaMarreco.innerHTML = "🦆 ✨ (IMAGEM DO MARRECO MUITO FELIZ)"; 
    } else {
        msg.innerText = "MUITO BEM! QUE TAL TENTAR DE NOVO PARA CONHECER MAIS? ❤️";
        areaMarreco.innerHTML = "🦆 💪 (IMAGEM DO MARRECO INCENTIVANDO)"; 
    }
}