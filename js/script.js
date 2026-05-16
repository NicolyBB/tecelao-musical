/* =======================================================
   SELECIONANDO OS ELEMENTOS DO HTML
   Puxamos todos os IDs da tela para manipulá-los no JS
======================================================== */
const bolinha = document.getElementById('bolinhaCaindo');
const alvo = document.getElementById('linhaAlvo');
const modal = document.getElementById('modalPergunta');
const fundo = document.getElementById('fundoRevelacao');
const dicaEspaco = document.querySelector('.dica-espaco-lateral');
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
const pathDancando = [
// Wander    { src: "./assets/animacoes/marrecoDancando.webm", type: "video/webm" }, acho q isso n é mais necessário
    { src: "./assets/animacoes/marrecoDancando.mp4", type: "video/mp4" }
];
const pathComemorando = [
// wander    { src: "./assets/animacoes/marrecoComemorando.webm", type: "video/webm" },
    { src: "./assets/animacoes/marrecoComemorando.mp4", type: "video/mp4" }
];

const somBotao = new Audio("./assets/sons/botao.mp3");
const somAcerto = new Audio("./assets/sons/acerto.mp3");
const somErro = new Audio("./assets/sons/erro.mp3");
let audioNarracaoAtual = null;
let musicaFundoAtual = null;
let caminhoMusicaFundoAtual = "";
const volumeMusicaFundo = 0.14;

function tocarSom(som) {
    som.currentTime = 0;
    som.onended = null;
    som.play().catch(e => console.log("Erro ao tocar som:", e));
}

function tocarEfeitoEResposta(som, numeroPergunta) {
    pararNarracao();
    som.currentTime = 0;
    som.onended = () => {
        som.onended = null;
        tocarResposta(numeroPergunta);
    };
    som.play().catch(e => console.log("Erro ao tocar som:", e));
}

function pararNarracao() {
    if (audioNarracaoAtual) {
        audioNarracaoAtual.pause();
        audioNarracaoAtual.currentTime = 0;
        audioNarracaoAtual = null;
    }
}

function caminhoResposta(numeroPergunta) {
    return numeroPergunta === 1
        ? "./assets/sons/Resposta.m4a"
        : `./assets/sons/Resposta ${numeroPergunta}.m4a`;
}

function tocarSequenciaAudios(caminhos, indice = 0) {
    pararNarracao();

    if (indice >= caminhos.length) return;

    const audio = new Audio(caminhos[indice]);
    audioNarracaoAtual = audio;
    audio.onended = () => tocarSequenciaAudios(caminhos, indice + 1);
    audio.play().catch(e => console.log("Erro ao tocar narração:", e));
}

function tocarPerguntaEOpcoes(numeroPergunta) {
    tocarSequenciaAudios([
        `./assets/sons/Questão ${numeroPergunta}.m4a`,
        `./assets/sons/Opções ${numeroPergunta}.m4a`
    ]);
}

function tocarResposta(numeroPergunta) {
    tocarSequenciaAudios([caminhoResposta(numeroPergunta)]);
}

function tocarMusicaFase(caminhoMusica) {
    if (!caminhoMusica) return;

    if (musicaFundoAtual && caminhoMusicaFundoAtual === caminhoMusica) {
        return;
    }

    pararMusicaFase();

    musicaFundoAtual = new Audio(caminhoMusica);
    caminhoMusicaFundoAtual = caminhoMusica;
    musicaFundoAtual.loop = true;
    musicaFundoAtual.volume = volumeMusicaFundo;
    musicaFundoAtual.play().catch(e => console.log("Erro ao tocar música da fase:", e));
}

function pararMusicaFase() {
    if (musicaFundoAtual) {
        musicaFundoAtual.pause();
        musicaFundoAtual.currentTime = 0;
        musicaFundoAtual = null;
        caminhoMusicaFundoAtual = "";
    }
}

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
const perguntasOrdenadas = [
    { p: "NA FESTA MAIS ANIMADA DE BRUSQUE, A FENARRECO, A GENTE CANTA E DANÇA IMITANDO QUAL BICHINHO?", opts: ["O CACHORRINHO 🐶", "O MARRECO (UM TIPO DE PATO) 🦆", "O GATINHO 🐱"], corr: 1, cur: "🎵 A TRADICIONAL DANÇA DO MARRECO É MÚSICA DE BANDINHA ALEMÃ!", img: "Imagem1.jpeg" },
    { p: "QUAL INSTRUMENTO MUSICAL FAZ UM SOM DIVERTIDO PARECIDO COM 'FOM-FOM' NAS FESTAS DA CIDADE?", opts: ["A SANFONA (GAITA OU ACORDEON) 🪗", "O VIOLÃO 🎸", "A FLAUTA 🪈"], corr: 0, cur: "🎵 MÚSICAS TRADICIONAIS DE GAITA TOCAM NOS PAVILHÕES DA FESTA!", img: "Imagem2.jpeg" },
    { p: "QUANDO TOCA A MÚSICA DA FESTA, QUE ROUPA BONITA E DIFERENTE AS CRIANÇAS VESTEM PARA DANÇAR?", opts: ["ROUPA DE ASTRONAUTA 🧑‍🚀", "ROUPA DE DORMIR (PIJAMA) 🛌", "ROUPINHA ALEMÃ (COM SUSPENSÓRIO E VESTIDO RODADO) 👗👖"], corr: 2, cur: "🎵 MARCHINHAS ALEGRES DE DESFILE ANIMAM A FESTA!", img: "Imagem3.jpeg" },
    { p: "BRUSQUE FAZ MUITOS TECIDOS PARA AS NOSSAS ROUPAS! QUE BARULHINHO A MÁQUINA DE TECER FAZ?", opts: ["MIAU, MIAU 🐈", "TEC-TEC, TIC-TAC 🧵", "PIU-PIU 🐥"], corr: 1, cur: "🎵 O RITMO DAS MÁQUINAS TRABALHANDO É A MÚSICA DO TEAR!", img: "Imagem4.jpeg" },
    { p: "NO LUGAR CHAMADO AZAMBUJA, O QUE FICA LÁ NO ALTO DA IGREJA E FAZ 'BLEM, BLOM' BEM ALTO?", opts: ["O SINO 🔔", "UM AVIÃO ✈️", "UM PASSARINHO 🐦"], corr: 0, cur: "🎵 OS SINOS DO SANTUÁRIO DE AZAMBUJA TOCAM COMO MÚSICA NO CÉU!", img: "Imagem5.jpeg" },
    { p: "COMO A GENTE BATE PALMA QUANDO A BANDINHA ALEMÃ PASSA TOCANDO NAS RUAS DE BRUSQUE?", opts: ["BEM DEVAGARINHO E COM SONO 🥱", "NO RITMO DA MARCHA, BEM FORTE! 👏", "A GENTE ESCONDE AS MÃOS 🙈"], corr: 1, cur: "🎵 AS MARCHAS DE DESFILE DA FENARRECO PEDEM PALMAS FORTES!", img: "Imagem6.jpeg" },
    { p: "NA MÚSICA DO MARRECO, COMO É O SOM QUE O BICO DO MARRECO FAZ QUANDO ELE CANTA?", opts: ["AU AU 🐕", "MUUUU 🐄", "QUÁ, QUÁ, QUÁ! 🦆"], corr: 2, cur: "🎵 AS CANTIGAS INFANTIS BRINCAM COM OS SONS DOS ANIMAIS!", img: "Imagem7.jpeg" },
    { p: "NAS MÚSICAS EM RODA DA TRADIÇÃO ALEMÃ, COMO AS PESSOAS GOSTAM DE DANÇAR?", opts: ["SOZINHAS E DE COSTAS 🧍", "DE MÃOS DADAS FORMANDO UMA RODA GIGANTE! 🤝", "DEITADAS NO CHÃO 🛌"], corr: 1, cur: "🎵 A DANÇA FOLCLÓRICA DE RODA JUNTA TODO MUNDO!", img: "Imagem8.jpeg" },
    { p: "NO DESFILE DE BRUSQUE, QUAL É O INSTRUMENTO ENORME QUE FAZ UM BARULHO QUE TREME A BARRIGA: 'BUM, BUM, BUM'?", opts: ["O TRIÂNGULO 🔺", "O CHOCALHO 🪇", "O BUMBO (UM TAMBOR BEM GRANDÃO) 🥁"], corr: 2, cur: "🎵 OS TAMBORES DAS BANDAS MARCIAIS FAZEM A BARRIGA TREMER!", img: "Imagem9.jpeg" },
    { p: "QUAL DOCE GOSTOSO, QUE PARECE UM LAÇO OU UM ABRAÇO, A GENTE COME ENQUANTO OUVE AS MÚSICAS DA FESTA?", opts: ["PRETZEL (BREZAL) 🥨", "SOPA DE LETRINHAS 🥣", "ALFACE 🥬"], corr: 0, cur: "🎵 AS MÚSICAS ALEGRES EMBALAM A VILA GASTRONÔMICA DE BRUSQUE!", img: "Imagem10.jpeg" },
    { p: "BRUSQUE TEM UM RIO BEM GRANDE CHAMADO RIO ITAJAÍ-MIRIM. QUE SOM A ÁGUA FAZ?", opts: ["VRUMMM (IGUAL CARRO) 🚗", "CHUÁÁ, CHUÁÁ (ÁGUA CORRENDO) 🌊", "PIII (IGUAL APITO)"], corr: 1, cur: "🎵 O SOM DA ÁGUA É A CANÇÃO DO RIO E DA NATUREZA!", img: "Imagem11.jpeg" },
    { p: "NAS FESTAS COM MÚSICA, QUE CORES A GENTE VÊ ENFEITANDO TUDO PARA LEMBRAR A BANDEIRA DA ALEMANHA?", opts: ["SÓ BRANCO ⚪", "PRETO, VERMELHO E AMARELO 🖤❤️💛", "ROSA E ROXO 🩷💜"], corr: 1, cur: "🎵 HINOS E CANÇÕES CELEBRAM A CULTURA DOS IMIGRANTES!", img: "Imagem12.jpeg" },
    { p: "O QUE AS VOVÓS E VOVÔS CANTAM BEM BAIXINHO PARA OS BEBÊS DORMIREM EM BRUSQUE?", opts: ["ROCK N' ROLL BEM ALTO 🎸", "CANTIGAS DE NINAR (MÚSICAS CALMINHAS) 👶🎵", "SOM DE BUZINA DE CAMINHÃO 🚛"], corr: 1, cur: "🎵 GUTEN ABEND, GUTE NACHT É UMA CANTIGA DE NINAR TRADICIONAL ALEMÃ!", img: "Imagem13.jpeg" },
    { p: "ALÉM DA SANFONA, QUE OUTRO INSTRUMENTO TEM TECLAS QUE PARECEM DENTES BRANCOS E PRETOS?", opts: ["O TECLADO/PIANO 🎹", "O PANDEIRO 🪘", "A BATERIA 🥁"], corr: 0, cur: "🎵 MELODIAS CLÁSSICAS TAMBÉM TOCAM NAS ESCOLAS DE MÚSICA DE BRUSQUE!", img: "Imagem14.jpeg" },
    { p: "QUANDO A FESTA ACABA E A BANDINHA TOCA A ÚLTIMA MÚSICA, O QUE A GENTE FAZ COM A MÃOZINHA?", opts: ["DÁ UM TCHAU BEM FELIZ (TSCHÜSS!) 👋", "DÁ UM SUSTO (BU!) 👻", "ESCONDE A MÃO NO BOLSO 👖"], corr: 0, cur: "🎵 A MÚSICA DE DESPEDIDA ENCERRA A FESTA COM ALEGRIA!", img: "Imagem15.jpeg" }
];

const musicasPorPergunta = [
    "./assets/musicas/imitamarreco.mp3",
    "./assets/musicas/sanfona.mp3",
    "./assets/musicas/roupa_alema.mp3",
    "./assets/musicas/tecer.mp3",
    "./assets/musicas/sino.mp3",
    "./assets/musicas/banda.mp3",
    "./assets/musicas/marreco.mp3",
    "./assets/musicas/tradicao_danca.mp3",
    "./assets/musicas/tambor.mp3",
    "./assets/musicas/pretzel.mp3",
    "./assets/musicas/rio.mp3",
    "./assets/musicas/bandeira.mp3",
    "./assets/musicas/ninar.mp3",
    "./assets/musicas/piano.mp3",
    "./assets/musicas/tchau.mp3"
];

function trocarVideoMarreco(fontes) {
    const fontePrincipal = fontes[0].src;

    if (videoMarreco.dataset.videoAtual !== fontePrincipal) {
        videoMarreco.dataset.videoAtual = fontePrincipal;
        videoMarreco.innerHTML = "";

        fontes.forEach((fonte) => {
            const source = document.createElement('source');
            source.src = fonte.src;
            source.type = fonte.type;
            videoMarreco.appendChild(source);
        });

        videoMarreco.load();
        videoMarreco.play().catch(e => console.log("Erro ao carregar animação:", e));
    }
}

function iniciarJogo() {
    const nome = document.getElementById('inputNome').value || "JOGADOR";
    document.getElementById('nomeJogador').innerText = nome.toUpperCase();
    
    telaIdentificacao.classList.add('oculto');
    containerJogo.classList.remove('oculto');
    
    perguntasEmbaralhadas = perguntasOrdenadas.map((pergunta, index) => ({
        ...pergunta,
        musica: musicasPorPergunta[index]
    }));
    
    prepararFundoFase();
    trocarVideoMarreco(pathDancando);
    animarBolinha();
}

function prepararFundoFase() {
    const q = perguntasEmbaralhadas[perguntaAtualIndex];
    fundo.src = `./assets/imgs/${q.img}`;
    tocarMusicaFase(q.musica);
    
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
        tocarSom(somBotao);
        
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
    const numeroPergunta = perguntaAtualIndex + 1;
    
    document.getElementById('perguntaTexto').innerText = q.p;
    document.getElementById('contadorFase').innerText = `FASE ${perguntaAtualIndex + 1}/15`;
    
    containerOpcoes.innerHTML = "";
    q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = "btn-resposta";
        btn.innerText = opt;
        btn.onclick = () => verificarRespostaQuiz(i === q.corr, q.cur, numeroPergunta);
        containerOpcoes.appendChild(btn);
    });

    document.getElementById('btnVoz').onclick = () => {
        tocarPerguntaEOpcoes(numeroPergunta);
    };

    trocarVideoMarreco(pathDancando);
    dicaEspaco.classList.add('oculto');
    bolinha.classList.add('oculto');

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
        tocarPerguntaEOpcoes(numeroPergunta);
    }, 800);
}

function verificarRespostaQuiz(correto, curiosidade, numeroPergunta) {
    const tituloFeedback = document.getElementById('tituloFeedback');
    const feedback = document.getElementById('feedbackResposta');

    if (correto) {
        totalAcertosQuiz++;
        tituloFeedback.innerText = "🎉 MUITO BEM! VOCÊ ACERTOU!";
        feedback.style.background = "rgba(40, 167, 69, 0.8)"; 
        tocarEfeitoEResposta(somAcerto, numeroPergunta);
        trocarVideoMarreco(pathComemorando);
    } else {
        tituloFeedback.innerText = "🤔 OPS! QUASE LÁ, MAS OLHA SÓ:";
        feedback.style.background = "rgba(208, 0, 0, 0.8)"; 
        tocarEfeitoEResposta(somErro, numeroPergunta);
        trocarVideoMarreco(pathDancando);
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
    pararNarracao();
    perguntaAtualIndex++;
    if (perguntaAtualIndex < 15) {
        modal.classList.add('oculto');
        dicaEspaco.classList.remove('oculto');
        bolinha.classList.remove('oculto');
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
    pararNarracao();
    pararMusicaFase();
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
