/* =======================================================
   SELECIONANDO OS ELEMENTOS DO HTML
   Puxamos todos os IDs da tela para manipulá-los no JS
======================================================== */
const bolinha = document.getElementById('bolinhaCaindo');
const alvo = document.getElementById('linhaAlvo');
const modal = document.getElementById('modalPergunta');
const fundo = document.getElementById('fundoRevelacao');
const indicadorVelocidade = document.getElementById('txtVelocidade');
const containerOpcoes = document.getElementById('containerOpcoes');
const telaIdentificacao = document.getElementById('telaIdentificacao');
const containerJogo = document.getElementById('containerJogo');
const telaResultado = document.getElementById('telaResultado');
const imagemPerguntaMini = document.getElementById('imagemPerguntaMini');
const videoMarreco = document.getElementById('videoMarreco');

/* =======================================================
   VARIÁVEIS DE CONTROLE DO JOGO E PONTUAÇÃO
======================================================== */
let posicaoY = -70; 
let velocidade = 2; 
let animacaoId;
let acertosRitmo = 0;
const totalParaRevelar = 4; // Opacidade: 25%, 50%, 75%, 100%
let perguntaAtualIndex = 0;
let totalAcertosQuiz = 0;
let perguntasEmbaralhadas = [];

/* =======================================================
   CAMINHOS PARA AS ANIMAÇÕES DO MARRECO
======================================================== */
const pathDancando = "./assets/animacoes/marrecoDancando.mp4";
const pathComemorando = "./assets/animacoes/marrecoComemorando.mp4";

/* =======================================================
   INICIALIZAÇÃO DE PARTÍCULAS NO LOGIN
======================================================== */
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": ["#FFCE00", "#D00000", "#FFFFFF"] },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.7, "random": true },
        "size": { "value": 5, "random": true },
        "line_linked": { "enable": false },
        "move": { "enable": true, "speed": 3, "direction": "none", "random": true, "out_mode": "out" }
    },
    "interactivity": { "events": { "onhover": { "enable": false }, "onclick": { "enable": false } } }
});

/* =======================================================
   BANCO DE PERGUNTAS E IMAGENS
======================================================== */
const bancoPerguntas = [
    { p: "NA FESTA DA FENARRECO, A GENTE IMITA QUAL BICHINHO?", opts: ["CACHORRINHO", "MARRECO 🦆", "GATINHO"], corr: 1, cur: "🎵 A DANÇA DO MARRECO É TRADICIONAL EM BRUSQUE!", img: "Imagem1.jpeg" },
    { p: "QUAL INSTRUMENTO FAZ UM SOM DE 'FOM-FOM'?", opts: ["SANFONA 🪗", "VIOLÃO", "FLAUTA"], corr: 0, cur: "🎵 A SANFONA É MUITO USADA NAS BANDINHAS ALEMÃS!", img: "Imagem2.jpeg" },
    { p: "QUE ROUPA O FRITZ E A FRIDA USAM PARA DANÇAR?", opts: ["ASTRONAUTA", "PIJAMA", "ROUPINHA ALEMÃ 👗"], corr: 2, cur: "🎵 AS ROUPAS TÍPICAS SÃO LINDAS E COLORIDAS!", img: "Imagem3.jpeg" },
    { p: "QUE BARULHINHO A MÁQUINA DE TECER FAZ?", opts: ["MIAU MIAU", "TEC-TEC, TIC-TAC 🧵", "PIU-PIU"], corr: 1, cur: "🎵 BRUSQUE É FAMOSA PELOS SEUS TECIDOS!", img: "Imagem4.jpeg" },
    { p: "O QUE FICA NO ALTO DA IGREJA DE AZAMBUJA E FAZ 'BLEM-BLOM'?", opts: ["O SINO 🔔", "UM AVIÃO", "PASSARINHO"], corr: 0, cur: "🎵 OS SINOS DE AZAMBUJA TOCAM UMA LINDA MÚSICA!", img: "Imagem5.jpeg" },
    { p: "COMO A GENTE BATE PALMA NA MARCHA ALEMÃ?", opts: ["DEVAGAR", "NO RITMO (UM, DOIS!) 👏", "ESCONDE AS MÃOS"], corr: 1, cur: "🎵 AS PALMAS ACOMPANHAM O RITMO DA BANDA!", img: "Imagem6.jpeg" },
    { p: "COMO É O SOM QUE O BICO DO MARRECO FAZ?", opts: ["AU AU", "MUUUU", "QUÁ, QUÁ, QUÁ! 🦆"], corr: 2, cur: "🎵 O MARRECO CANTA MUITO NAS FESTAS!", img: "Imagem7.jpeg" },
    { p: "COMO AS PESSOAS DANÇAM NAS RODAS ALEMÃS?", opts: ["SOZINHAS", "DE MÃOS DADAS 🤝", "DEITADAS"], corr: 1, cur: "🎵 A DANÇA DE RODA UNE TODOS OS AMIGOS!", img: "Imagem8.jpeg" },
    { p: "QUAL INSTRUMENTO FAZ O SOM 'BUM, BUM, BUM'?", opts: ["TRIÂNGULO", "CHOCALHO", "BUMBO (TAMBOR) 🥁"], corr: 2, cur: "🎵 O BUMBO FAZ A NOSSA BARRIGA TREMER!", img: "Imagem9.jpeg" },
    { p: "QUAL DOCE GOSTOSO PARECE UM LAÇO OU UM ABRAÇO?", opts: ["PRETZEL 🥨", "SOPA", "ALFACE"], corr: 0, cur: "🎵 O PRETZEL É UM LANCHE TÍPICO MUITO GOSTOSO!", img: "Imagem10.jpeg" },
    { p: "QUE SOM A ÁGUA DO RIO ITAJAÍ-MIRIM FAZ?", opts: ["VRUMMM", "CHUÁÁ, CHUÁÁ 🌊", "PIII"], corr: 1, cur: "🎵 O SOM DO RIO É A MÚSICA DA NATUREZA!", img: "Imagem11.jpeg" },
    { p: "QUAIS AS CORES DA BANDEIRA DA ALEMANHA?", opts: ["SÓ BRANCO", "PRETO, VERMELHO E AMARELO 🖤❤️💛", "ROSA"], corr: 1, cur: "🎵 ESSAS CORES ENFEITAM TODA A NOSSA FESTA!", img: "Imagem12.jpeg" },
    { p: "O QUE OS AVÓS CANTAM PARA OS BEBÊS DORMIREM?", opts: ["ROCK ALTO", "CANTIGAS DE NINAR 👶", "BUZINA"], corr: 1, cur: "🎵 AS CANTIGAS ALEMÃS SÃO MUITO CALMINHAS!", img: "Imagem13.jpeg" },
    { p: "QUE INSTRUMENTO TEM TECLAS BRANCAS E PRETAS?", opts: ["TECLADO/PIANO 🎹", "PANDEIRO", "BATERIA"], corr: 0, cur: "🎵 O PIANO TOCA MELODIAS MUITO LINDAS!", img: "Imagem14.jpeg" },
    { p: "O QUE FAZEMOS COM A MÃO QUANDO A FESTA ACABA?", opts: ["DAMOS TCHAU 👋", "DAMOS UM SUSTO", "MÃO NO BOLSO"], corr: 0, cur: "🎵 DIZEMOS 'TSCHÜSS' PARA NOS DESPEDIR!", img: "Imagem15.jpeg" }
];

/* =======================================================
   GERENCIAMENTO DE VÍDEO E INÍCIO
======================================================== */
function trocarVideoMarreco(caminho) {
    if (videoMarreco.src !== caminho) {
        videoMarreco.src = caminho;
        videoMarreco.load();
        videoMarreco.play().catch(e => console.log("Erro ao carregar animação:", e));
    }
}

function iniciarJogo() {
    const nome = document.getElementById('inputNome').value || "JOGADOR";
    document.getElementById('nomeJogador').innerText = nome.toUpperCase();
    
    telaIdentificacao.classList.add('oculto');
    containerJogo.classList.remove('oculto');
    
    perguntasEmbaralhadas = [...bancoPerguntas].sort(() => Math.random() - 0.5);
    
    prepararFundoFase();
    trocarVideoMarreco(pathDancando);
    animarBolinha();
}

function prepararFundoFase() {
    const q = perguntasEmbaralhadas[perguntaAtualIndex];
    fundo.src = `./assets/imgs/${q.img}`;
    
    fundo.style.width = '100%';
    fundo.style.height = '100%';
    fundo.style.top = '0';
    fundo.style.left = '0';
    fundo.style.borderRadius = '0';
    fundo.style.border = 'none';
    fundo.style.zIndex = '1';
    fundo.style.opacity = '0'; 
}

/* =======================================================
   MECÂNICA DE QUEDA E COLISÃO
======================================================== */
function animarBolinha() {
    posicaoY += velocidade;
    bolinha.style.top = posicaoY + 'px';

    const rectBolinha = bolinha.getBoundingClientRect();

    if (rectBolinha.top > window.innerHeight) {
        posicaoY = -70;
        velocidade = 2; 
        indicadorVelocidade.innerText = "VELOCIDADE: 🐌 LENTO";
    }

    animacaoId = requestAnimationFrame(animarBolinha);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !containerJogo.classList.contains('oculto') && modal.classList.contains('oculto')) {
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
        
        alvo.classList.add('acerto-ritmo-feedback');
        setTimeout(() => alvo.classList.remove('acerto-ritmo-feedback'), 300);

        fundo.style.opacity = (acertosRitmo * 0.25).toString();

        if (velocidade < 6) {
            velocidade += 0.8;
            if (velocidade > 4) indicadorVelocidade.innerText = "VELOCIDADE: 🚶 NORMAL";
            if (velocidade > 5.5) indicadorVelocidade.innerText = "VELOCIDADE: 🐇 RÁPIDO";
        }

        if (acertosRitmo >= totalParaRevelar) {
            cancelAnimationFrame(animacaoId);
            setTimeout(mostrarPerguntaModal, 400); 
        }
    }
}

/* =======================================================
   EXIBIÇÃO DE DESAFIO E EFEITO DE VOO
======================================================== */
function mostrarPerguntaModal() {
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

    document.getElementById('btnVoz').onclick = () => {
        const fala = new SpeechSynthesisUtterance(q.p);
        fala.lang = 'pt-BR';
        window.speechSynthesis.speak(fala);
    };

    trocarVideoMarreco(pathComemorando);

    modal.classList.remove('oculto');
    imagemPerguntaMini.src = `./assets/imgs/${q.img}`;
    imagemPerguntaMini.style.opacity = '0';
    
    const rectMini = imagemPerguntaMini.getBoundingClientRect();
    const areaRitmo = document.querySelector('.area-ritmo').getBoundingClientRect();

    const topoDestino = rectMini.top - areaRitmo.top;
    const esquerdaDestino = rectMini.left - areaRitmo.left;

    fundo.style.width = rectMini.width + 'px';
    fundo.style.height = rectMini.height + 'px';
    fundo.style.top = topoDestino + 'px';
    fundo.style.left = esquerdaDestino + 'px';
    fundo.style.borderRadius = '20px';
    fundo.style.border = '4px solid var(--alemana-amarelo)';
    fundo.style.zIndex = '105'; 
    
    setTimeout(() => {
        imagemPerguntaMini.style.opacity = '1'; 
        fundo.style.opacity = '0'; 
    }, 800);
}

function verificarRespostaQuiz(correto, curiosidade) {
    const tituloFeedback = document.getElementById('tituloFeedback');
    const feedback = document.getElementById('feedbackResposta');

    if (correto) {
        totalAcertosQuiz++;
        tituloFeedback.innerText = "🎉 MUITO BEM! VOCÊ ACERTOU!";
        feedback.style.background = "rgba(40, 167, 69, 0.8)"; 
    } else {
        tituloFeedback.innerText = "🤔 OPS! QUASE LÁ, MAS OLHA SÓ:";
        feedback.style.background = "rgba(208, 0, 0, 0.8)"; 
    }
    
    containerOpcoes.classList.add('oculto');
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
        
        prepararFundoFase(); 
        trocarVideoMarreco(pathDancando);
        animarBolinha();     
    } else {
        exibirResultadoFinal();
    }
}

function exibirResultadoFinal() {
    containerJogo.classList.add('oculto');
    telaResultado.classList.remove('oculto');
    
    const porcentagem = (totalAcertosQuiz / 15) * 100;
    const msg = document.getElementById('mensagemFinal');
    const areaMarreco = document.getElementById('areaMarrecoFinal');

    if (porcentagem >= 80) {
        msg.innerText = "VOCÊ É UM AMIGO DE BRUSQUE! PARABÉNS! 🌟";
        areaMarreco.innerHTML = "🦆 ✨ FESTA DO MARRECO!"; 
    } else {
        msg.innerText = "MUITO BEM! QUE TAL TENTAR DE NOVO PARA CONHECER MAIS? ❤️";
        areaMarreco.innerHTML = "🦆 💪 VOCÊ CONSEGUE!"; 
    }
}