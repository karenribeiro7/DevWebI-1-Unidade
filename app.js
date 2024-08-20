function init() {//função que vai chamar as outras funções para serem executadas quando o documento for carregado
    aplicarMascaraTelefone();
    sugestaoAutomatica();
}

document.addEventListener('DOMContentLoaded', init);


document.addEventListener('DOMContentLoaded', () => { //quando o documento for carregado ele vai adicionar a classe active no menu e vai mostrar o menu hamburguer (manter responsividade da navbar)
    const toggleButton = document.querySelector('.navbar__toggle');
    const navbar = document.querySelector('.navbar');

    toggleButton.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
});

function aplicarMascaraTelefone() {
    const telefone = document.getElementById('telefone-receita');
    telefone.addEventListener('input', (event) => {//vai chamar a função para aplicar a máscara no campo de telefone
        let valor = event.target.value.replace(/\D/g, '');//vai remover todos os caracteres que não são números
        
        let valorMaximo = '';
        for (let i = 0; i < valor.length; i++) {//adicionando os valores até chegar em 11
            if (i < 11) {
                valorMaximo += valor[i];
            }
        }
        
        if (valorMaximo.length === 11) {//se o valor digitado for igual a 11 ele vai aplicar a máscara
            valorMaximo = valorMaximo.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        }

        event.target.value = valorMaximo;
    });
}


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
