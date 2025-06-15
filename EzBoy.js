script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
document.head.appendChild(script);

(async () => {
    console.clear();
    const noop = () => {};
    console.warn = console.error = window.debug = noop;

    class NotificationSystem {
        constructor() {
            this.initStyles();
            this.notificationContainer = this.createContainer();
            document.body.appendChild(this.notificationContainer);
        }

        initStyles() {
            const styleId = 'custom-notification-styles';
            if (document.getElementById(styleId)) return;

            const css = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    pointer-events: none;
                }
                .notification {
                    background: rgba(20, 20, 20, 0.9);
                    color: #f0f0f0;
                    margin-bottom: 10px;
                    padding: 12px 18px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    backdrop-filter: blur(8px);
                    font-family: 'Inter', system-ui;
                    font-size: 13.5px;
                    width: 280px;
                    min-height: 50px;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                    pointer-events: auto;
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .notification.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .notification-icon {
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .notification-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    width: 100%;
                    background: #f0f0f0;
                    opacity: 0.8;
                }
                @keyframes progress-animation {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .notification-progress.animate {
                    animation: progress-animation linear forwards;
                }
                .notification.success .notification-icon { color: #4caf50; }
                .notification.error .notification-icon { color: #f44336; }
                .notification.info .notification-icon { color: #2196f3; }
                .notification.warning .notification-icon { color: #ff9800; }
            `;

            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            document.head.appendChild(style);
        }

        createContainer() {
            const container = document.createElement('div');
            container.className = 'notification-container';
            return container;
        }

        createIcon(type) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'notification-icon';
            let iconSvg = '';

            switch(type) {
                case 'success':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" ...><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
                    break;
                case 'error':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" ...><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
                    break;
                case 'warning':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" ...><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
                    break;
                case 'info':
                default:
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" ...><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
            }

            iconWrapper.innerHTML = iconSvg;
            return iconWrapper;
        }

        show(message, options = {}) {
            const { duration = 5000, type = 'info' } = options;
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;

            const icon = this.createIcon(type);
            notification.appendChild(icon);

            const textSpan = document.createElement('span');
            textSpan.textContent = message;
            notification.appendChild(textSpan);

            const progressBar = document.createElement('div');
            progressBar.className = 'notification-progress';
            notification.appendChild(progressBar);

            this.notificationContainer.appendChild(notification);

            notification.offsetHeight;
            notification.classList.add('show');

            progressBar.classList.add('animate');
            progressBar.style.animationDuration = `${duration}ms`;

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        this.notificationContainer.removeChild(notification);
                    }
                }, 300);
            }, duration);

            return notification;
        }

        success(message, duration = 5000) {
            return this.show(message, { type: 'success', duration });
        }
        error(message, duration = 5000) {
            return this.show(message, { type: 'error', duration });
        }
        info(message, duration = 5000) {
            return this.show(message, { type: 'info', duration });
        }
        warning(message, duration = 5000) {
            return this.show(message, { type: 'warning', duration });
        }
    }

    function copiarParaAreaDeTransferencia(texto) {
        navigator.clipboard.writeText(texto).then(() => {
            notifications.info("Dados de login copiados para a área de transferência!", 5000);
        }).catch(err => {
            notifications.error("Erro ao copiar para a área de transferência.", 5000);
        });
    }

    const notifications = new NotificationSystem();
    const originalFetch = window.fetch;
    let capturedLoginData = null;

    window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        const method = init?.method || 'GET';

        if (url === 'https://edusp-api.ip.tv/registration/edusp/token' && !capturedLoginData) {
            try {
                const response = await originalFetch.apply(this, arguments);
                const clonedResponse = response.clone();
                const data = await clonedResponse.json();

                if (data?.auth_token) {
                    capturedLoginData = data;

                    const dados = JSON.stringify(data, null, 2);
                    copiarParaAreaDeTransferencia(dados);

                    notifications.success("Login bem-sucedido e token capturado!", 5000);
                }

                return response;
            } catch (error) {
                notifications.error("Erro ao capturar token.", 5000);
                return originalFetch.apply(this, arguments);
            }
        }

        const response = await originalFetch.apply(this, arguments);
        return response;
    };

    notifications.success(`TarefasResolver iniciado com sucesso!`, 3000);
    notifications.info("Aguardando o login no Sala do Futuro...", 6000);

})();