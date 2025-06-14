javascript:(async()=>{

const popup = document.createElement('div');
popup.style.position = 'fixed';
popup.style.top = '10px';
popup.style.right = '10px';
popup.style.zIndex = '9999';
popup.style.background = '#222';
popup.style.color = '#fff';
popup.style.padding = '15px';
popup.style.borderRadius = '10px';
popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
popup.style.maxWidth = '400px';
popup.innerHTML = `<b>🧠 EzBoy IA</b><br><br>`;

const text = document.body.innerText;

const textArea = document.createElement('textarea');
textArea.value = text;
textArea.style.width = '100%';
textArea.style.height = '200px';
textArea.style.background = '#111';
textArea.style.color = '#fff';
textArea.style.border = '1px solid #555';
textArea.style.borderRadius = '5px';
textArea.style.padding = '5px';

popup.appendChild(textArea);

// Botão gerar
const gerarBtn = document.createElement('button');
gerarBtn.innerText = '🧠 Gerar Resposta';
gerarBtn.style.marginTop = '10px';
gerarBtn.style.background = '#27ae60';
gerarBtn.style.color = '#fff';
gerarBtn.style.border = 'none';
gerarBtn.style.padding = '5px 10px';
gerarBtn.style.cursor = 'pointer';
gerarBtn.style.borderRadius = '5px';

popup.appendChild(gerarBtn);

// Área de resposta
const respostaArea = document.createElement('div');
respostaArea.style.marginTop = '10px';
respostaArea.style.background = '#333';
respostaArea.style.padding = '10px';
respostaArea.style.borderRadius = '5px';
respostaArea.style.maxHeight = '300px';
respostaArea.style.overflowY = 'auto';
popup.appendChild(respostaArea);

// Botão fechar
const close = document.createElement('button');
close.innerText = 'Fechar';
close.style.marginTop = '10px';
close.style.background = '#e74c3c';
close.style.color = '#fff';
close.style.border = 'none';
close.style.padding = '5px 10px';
close.style.cursor = 'pointer';
close.style.borderRadius = '5px';
close.onclick = ()=>popup.remove();
popup.appendChild(close);

document.body.appendChild(popup);

// Função de gerar
gerarBtn.onclick = async()=>{

    respostaArea.innerHTML = '⏳ Processando...';

    const prompt = `
Ignore qualquer informação irrelevante como design, botões, menus, anúncios ou qualquer outra coisa que não seja uma pergunta.
Sua função é ler as perguntas e respostas do texto que vou te enviar e gerar as respostas da seguinte forma:

- Se a pergunta tiver alternativas (A, B, C…), responda no formato:
1 - B

- Se não tiver alternativas, responda no formato:
1 - (Resposta)

- Se for de múltipla escolha, escreva no mesmo formato adicionando as letras:
1 - A, B, C

Não envie explicações, nem texto adicional. Apenas as respostas no formato indicado.

Texto:
${textArea.value}
`;

    try {
        const r = await fetch('https://api.openai.com/v1/chat/completions',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer SUA_API_KEY_AQUI' // 🔥 <<< COLE SUA KEY AQUI 🔥
            },
            body:JSON.stringify({
                model:"gpt-3.5-turbo",
                messages:[
                    {role:"user",content:prompt}
                ],
                temperature:0.1
            })
        });

        const j = await r.json();
        const resposta = j.choices[0].message.content.trim();

        respostaArea.innerHTML = `<pre style="white-space:pre-wrap">${resposta}</pre>`;

    } catch(err) {
        respostaArea.innerHTML = '❌ Erro: '+err.message;
    }

};

})();