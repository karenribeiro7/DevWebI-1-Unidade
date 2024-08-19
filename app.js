function loadPage(page) {
    fetch(page)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('A resposta da rede não foi bem-sucedida');
            }
            return response.text();
        })
        .then(function(data) {
            document.getElementById('main').innerHTML = data;
        })
        .catch(function(error) {
            console.error('Houve um problema com a operação de carregamento:', error);
            document.getElementById('main').innerHTML = "<h2>Erro ao carregar a página</h2><p>Desculpe, não foi possível carregar a página.</p>";
        });
}
