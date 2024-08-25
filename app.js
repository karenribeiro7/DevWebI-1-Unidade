
function init() {//função que vai chamar as outras funções para serem executadas quando o documento for carregado
    aplicarMascaraTelefone();
    indexedDB.deleteDatabase('ReceitasDB');//vai deletar o banco de dados para não ter problemas com a versão
}

document.addEventListener('DOMContentLoaded', init);//quando o documento for carregado ele vai chamar a função init


document.addEventListener('DOMContentLoaded', () => { //quando o documento for carregado ele vai adicionar a classe active no menu e vai mostrar o menu hamburguer (manter responsividade da navbar)
    const toggleButton = document.querySelector('.navbar__toggle');
    const navbar = document.querySelector('.navbar');

    toggleButton.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
});

document.querySelector('.forms').addEventListener('submit', function(event) {//quando o form for submetido ele vai armazenar os dados no indexedDB
    event.preventDefault(); //impedir o envio do formulário para não recarregar a página

    const emailReceita = document.getElementById('email-receita').value;
    const telefoneReceita = document.getElementById('telefone-receita').value;
    const nomeReceita = document.getElementById('nome-receita').value;
    const linkReceita = document.getElementById('link').value;
    const receitaPassos = document.getElementById('receita-passos').value;

    const imagemInput = document.getElementById('imagem');//vai pegar o input file da imagem para armazenar no indexedDB
    const imagemFile = imagemInput.files[0];//vai pegar o arquivo de imagem que o user selecionou para armazenar no indexedDB
    
    const reader = new FileReader();//vai ler o arquivo de imagem
    reader.onloadend = () => {
        const imagemDataURL = reader.result;//vai armazenar a imagem como Data URL

        const dbRequest = indexedDB.open('ReceitasDB', 1); //vai abrir o banco de dados

        dbRequest.onupgradeneeded = (event) => {//vai criar o banco de dados e a object store
            const db = event.target.result;
            console.log('Criando ou atualizando banco de dados...');
            if (!db.objectStoreNames.contains('receitas')) {
                db.createObjectStore('receitas', { keyPath: 'id', autoIncrement: true });
                console.log('Object store "receitas" criado');
            }
        };

        dbRequest.onsuccess = (event) => {//se o banco de dados for aberto com sucesso ele vai armazenar os dados
            console.log('Banco de dados aberto com sucesso');
            const db = event.target.result;
            const transaction = db.transaction(['receitas'], 'readwrite');
            const objectStore = transaction.objectStore('receitas');
            console.log('Object store "receitas" acessado com sucesso');
            
            objectStore.add({//vai adicionar os dados no indexedDB
                email: emailReceita,
                telefone: telefoneReceita,
                nome: nomeReceita,
                link: linkReceita,
                passos: receitaPassos,
                imagem: imagemDataURL //vai armazenar a imagem como Data URL
            });

            transaction.oncomplete = () => { //se os dados forem salvos com sucesso ele vai redirecionar para a página de sucesso
                window.location.href = 'formulario-sucesso.html';
            };

            transaction.onerror = (event) => {//se ocorrer um erro ao salvar os dados
                console.error('Erro ao salvar os dados', event);
            };
        };

        dbRequest.onerror = (event) => {//se ocorrer um erro ao abrir o banco de dados
            console.error('Erro ao abrir o banco de dados', event);
        };
    };

    reader.readAsDataURL(imagemFile);//vai ler o arquivo de imagem
});

document.addEventListener('DOMContentLoaded', () => {
    // Função para aplicar a máscara de telefone
    function aplicarMascaraTelefone() {
        const telefone = document.getElementById('telefone-receita');
        if (telefone) { // Verifica se o elemento existe
            telefone.addEventListener('input', (event) => {
                let valor = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
                
                let valorMaximo = '';
                for (let i = 0; i < valor.length; i++) { // Adiciona os valores até 11
                    if (i < 11) {
                        valorMaximo += valor[i];
                    }
                }
                
                if (valorMaximo.length === 11) { // Aplica a máscara se o valor for 11 dígitos
                    valorMaximo = valorMaximo.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                }

                event.target.value = valorMaximo;//vai adicionar o valor com a máscara no campo
            });
        }
    }

    // Chama a função para aplicar a máscara
    aplicarMascaraTelefone();
});


document.getElementById('email-receita').addEventListener('input', function(event) {//vai chamar a função para verificar se o email digitado é válido
    let email = event.target.value;
    event.target.value = validarEmail(email);
});

function validarEmail(valor) {
    let resultado = '';
    for (let i = 0; i < valor.length; i++) {//vai percorrer o valor digitado e vai verificar se é um caractere válido para um email (só aceita ponto, underscore e hifen)
        let char = valor[i];
        if (/[a-zA-Z0-9@._-]/.test(char)) { //se for um caractere válido ele vai adicionar no resultado mesmo
            resultado += char;
        }
    }

    let contadorCaractere = 0;
    let emailFinal = '';
    for (let i = 0; i < resultado.length; i++) {
        let char = resultado[i];
        if (char === '@') {//se o caractere for igual a @ ele vai contar
            contadorCaractere++;
            if (contadorCaractere === 1) {
                emailFinal += char;
            } else if (contadorCaractere > 1) {
                continue; //se tiver mais de um @ ele não vai adicionar, só aceita 1 pois é email
            }
        } else {//se não for @ ele vai adicionar o caractere normal
            emailFinal += char;
        }
    }

    return emailFinal;
}

function sugestaoAutomatica(nomeReceita) {//função que vai retornar as sugestões de receitas

    const receitas = ['Torta', 'Bolo', 'Pudim', 'Pastel','Coxinha','Pizza'];
            return receitas.filter((valor) => {//vai filtrar os valores que contém o nome da receita
                    const valorMinusculo = valor.toLowerCase()
                    const nomeReceitaMinusculo = nomeReceita.toLowerCase()
    
                    return valorMinusculo.includes(nomeReceitaMinusculo)
              })
       }
      const campo = document.querySelector('#nome-receita')
      const sugestoes = document.querySelector('.sugestoes')
    
      campo.addEventListener('input', ({ target }) => {//quando o user digitar algo no campo ele vai mostrar as sugestões
          const dadosDoCampo = target.value
          if (dadosDoCampo.length) {
            const sugestaoAutomaticaValores = sugestaoAutomatica(dadosDoCampo);
            if (sugestaoAutomaticaValores.length) {//se tiver sugestão ele vai mostrar a lista
                sugestoes.innerHTML = sugestaoAutomaticaValores.map((value) => {
                    return `<li>${value}</li>`;
                }).join('');
                sugestoes.style.display = 'block'; //mostrar as sugestões
            } else {
                sugestoes.style.display = 'none'; //esconder a lista quando não tem sugestão
            }
        } else {
            sugestoes.style.display = 'none'; //esconder a lista enquanto o user não entrar com um valor
        }
    });
    
    sugestoes.addEventListener('click', (event) => { //quando clicar em um item da lista de sugestões ele preenche o campo com o valor clicado
        if (event.target.tagName === 'LI') {//o evento só vai ser disparado se o user clicar em um item da lista (pois é li)
            campo.value = event.target.textContent; 
            sugestoes.style.display = 'none'; 
        }
    });