let pontosRodada1 = 1;
let pontosRodada2 = 1;
let vitorias1 = 0;
let vitorias2 = 0;

const audioTruco = new Audio("sounds/truco.mp3");
const audioVitoria = new Audio("sounds/vitoria.mp3");
const audioDerrota = new Audio("sounds/derrota.mp3");

const botaoPlay = document.getElementById("botao-play");
const telaInicio = document.getElementById("tela-inicio");
const loadingBarra = document.getElementById("loading-barra");

// Aguarda 10 segundos (duração do loading)
setTimeout(() => {
    // Esconde a barra de loading
    loadingBarra.style.display = "none";
    // Mostra o botão Play
    botaoPlay.style.display = "inline-block";
}, 10000);

// Ao clicar no botão Play
botaoPlay.addEventListener("click", () => {
    telaInicio.style.display = "none";
});


function setPontuacao(equipe) {
    const placar1 = parseInt(document.getElementById('placar-1').innerText);
    const placar2 = parseInt(document.getElementById('placar-2').innerText);

    if (placar1 >= 12 || placar2 >= 12) return;

    let pontosAtuais;
    let novoPonto;

    if (equipe === 1) {
        pontosAtuais = pontosRodada1;
        if (pontosAtuais === 1) novoPonto = 3;
        else if (pontosAtuais === 3) novoPonto = 6;
        else if (pontosAtuais === 6) novoPonto = 9;
        else if (pontosAtuais === 9) novoPonto = 12;
        pontosRodada1 = novoPonto;
        document.querySelector('.equipe-1 .botao-ponto').innerText = `+${novoPonto}`;
    } else {
        pontosAtuais = pontosRodada2;
        if (pontosAtuais === 1) novoPonto = 3;
        else if (pontosAtuais === 3) novoPonto = 6;
        else if (pontosAtuais === 6) novoPonto = 9;
        else if (pontosAtuais === 9) novoPonto = 12;
        pontosRodada2 = novoPonto;
        document.querySelector('.equipe-2 .botao-ponto').innerText = `+${novoPonto}`;
    }

    // Efeitos do truco
    tocarTruco();
    animarCartas();
}

function adicionarPonto(equipe) {
    const placarElement = document.getElementById(`placar-${equipe}`);
    let placarAtual = parseInt(placarElement.innerText);

    if (placarAtual >= 12 || (equipe === 1 && parseInt(document.getElementById('placar-2').innerText) >= 12) || (equipe === 2 && parseInt(document.getElementById('placar-1').innerText) >= 12)) {
        return;
    }

    placarAtual += (equipe === 1) ? pontosRodada1 : pontosRodada2;
    placarElement.innerText = placarAtual;

    if (equipe === 1) {
        pontosRodada1 = 1;
        document.querySelector('.equipe-1 .botao-ponto').innerText = '+1';
    } else {
        pontosRodada2 = 1;
        document.querySelector('.equipe-2 .botao-ponto').innerText = '+1';
    }

    verificarVitoria();
}

function ajustarPlacar(equipe, valor) {
    const placarElement = document.getElementById(`placar-${equipe}`);
    let placarAtual = parseInt(placarElement.innerText);

    if (placarAtual >= 12 || (equipe === 1 && parseInt(document.getElementById('placar-2').innerText) >= 12) || (equipe === 2 && parseInt(document.getElementById('placar-1').innerText) >= 12)) {
        return;
    }

    placarElement.innerText = placarAtual + valor;
}

function reiniciarJogo() {
    document.getElementById('placar-1').innerText = '0';
    document.getElementById('placar-2').innerText = '0';
    pontosRodada1 = 1;
    pontosRodada2 = 1;
    document.querySelector('.equipe-1 .botao-ponto').innerText = '+1';
    document.querySelector('.equipe-2 .botao-ponto').innerText = '+1';

    const botoes = document.querySelectorAll('button');
    botoes.forEach(button => button.disabled = false);

    document.getElementById('tela-vitoria').style.display = 'none';
    document.getElementById('placar-1').classList.remove("vitoria");
    document.getElementById('placar-2').classList.remove("vitoria");
}

function reiniciarGeral() {
    reiniciarJogo();
    vitorias1 = 0;
    vitorias2 = 0;
    atualizarVitorias();
}

function verificarVitoria() {
    const placar1 = parseInt(document.getElementById('placar-1').innerText);
    const placar2 = parseInt(document.getElementById('placar-2').innerText);
    const mensagemElement = document.getElementById('mensagem-vitoria');
    const nomeEquipe1 = document.querySelector('.equipe-1 .nome-equipe').innerText;
    const nomeEquipe2 = document.querySelector('.equipe-2 .nome-equipe').innerText;

    if (placar1 >= 12) {
        vitorias1++;
        mensagemElement.innerText = `${nomeEquipe1} VENCEU!`;
        atualizarVitorias();
        document.getElementById('tela-vitoria').style.display = 'flex';
        desativarBotoes();
        destacarPlacar(1);
        tocarVitoria();
        tocarDerrota();
        mostrarFogos();
    } else if (placar2 >= 12) {
        vitorias2++;
        mensagemElement.innerText = `${nomeEquipe2} VENCEU!`;
        atualizarVitorias();
        document.getElementById('tela-vitoria').style.display = 'flex';
        desativarBotoes();
        destacarPlacar(2);
        tocarVitoria();
        tocarDerrota();
        mostrarFogos();
    }
}

function desativarBotoes() {
    const botoes = document.querySelectorAll('button');
    botoes.forEach(button => {
        if (!button.classList.contains('botao-nova-partida')) {
            button.disabled = true;
        }
    });
}

function atualizarVitorias() {
    const vitoriasEquipe1 = document.querySelector('.equipe-1 .vitorias-container');
    const vitoriasEquipe2 = document.querySelector('.equipe-2 .vitorias-container');
    
    vitoriasEquipe1.innerHTML = '';
    vitoriasEquipe2.innerHTML = '';

    for (let i = 0; i < vitorias1; i++) {
        const trofeu = document.createElement('span');
        trofeu.className = 'trofeu';
        trofeu.innerHTML = '🏆';
        vitoriasEquipe1.appendChild(trofeu);
    }
    for (let i = 0; i < vitorias2; i++) {
        const trofeu = document.createElement('span');
        trofeu.className = 'trofeu';
        trofeu.innerHTML = '🏆';
        vitoriasEquipe2.appendChild(trofeu);
    }
}

function novaPartida() {
    reiniciarJogo();
}

function mostrarFogos() {
  const canvas = document.getElementById("fogos");
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  function createParticle(x, y) {
    for (let i = 0; i < 50; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 100
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
      ctx.fillRect(p.x, p.y, 3, 3);
      if (p.life <= 0) particles.splice(i,1);
    });
    if (particles.length > 0) requestAnimationFrame(animate);
    else canvas.style.display = "none";
  }

  createParticle(canvas.width/2, canvas.height/2);
  animate();
}

function destacarPlacar(equipe) {
  document.getElementById(`placar-${equipe}`).classList.add("vitoria");
}

function tocarTruco() { audioTruco.play(); }
function tocarVitoria() { audioVitoria.play(); }
function tocarDerrota() { audioDerrota.play(); }

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.log('Falha ao registrar SW', err));
  });
}

