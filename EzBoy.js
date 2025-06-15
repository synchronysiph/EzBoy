// Função para copiar texto para a área de transferência
function copiarParaAreaDeTransferencia(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        console.log('✅ Token e dados copiados para a área de transferência!');
    }).catch(err => {
        console.error('❌ Erro ao copiar: ', err);
    });
}

// Interceptar fetch
const originalFetch = window.fetch;
window.fetch = async function (...args) {
    const [url, config] = args;
    const response = await originalFetch.apply(this, args);

    try {
        if (url.includes("/registration/edusp/token")) {
            const responseClone = response.clone();
            const data = await responseClone.json();

            if (data && data.auth_token) {
                const token = data.auth_token;
                const dadosCompletos = JSON.stringify(data, null, 2);

                // Copia os dados para a área de transferência
                copiarParaAreaDeTransferencia(dadosCompletos);

                // Notificação visual
                notificationSystem.showNotification(
                    "🔑 Token copiado!",
                    "As informações do login foram copiadas para sua área de transferência.",
                    "info",
                    6000
                );

                console.log('✅ Token capturado:', token);
                console.log('📋 Dados completos:', dadosCompletos);
            }
        }
    } catch (err) {
        console.error('❌ Erro ao processar a resposta:', err);
    }

    return response;
};