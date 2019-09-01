let dbRef = firebase.database().ref("usuarios");
let load = document.querySelector('.load');
let tabel = document.querySelector('.tabel');
let table = document.querySelector('.tablemano');
let nome = document.querySelector('.nomeInput');
let email = document.querySelector('.emailInput');
let telefone = document.querySelector('.telefoneInput');
let editt = document.querySelector('.editt');
let enviar = document.querySelector('.enviar');
let editar = document.querySelector('.editar');
let cancelar = document.querySelector('.cancelar');
let key;

window.onload = function carrega(){
	carregaUsuarios().then(function(){
		addListeners();

	},function(e){
		console.log(e);
	});
}


function dados(variavel,campo,novo){
	variavel = document.createElement('td');
	variavel.innerHTML = campo;  
	novo.appendChild(variavel);  
}

function botoes(variavel,botao,classe1,classe2,html,dado){
	variavel = document.createElement('td'); 
	botao = document.createElement('buttom'); 
	botao.classList.add('btn'); 
	botao.classList.add(classe1);
	botao.classList.add(classe2);
	botao.setAttribute("value", dado); 
	botao.innerHTML = html; 
	variavel.appendChild(botao);
	novoElementoTR.appendChild(variavel); 
}

function carregaUsuarios(){
		return new Promise(function(resolve, reject){
			tabel.innerHTML = '';
			dbRef.orderByChild('nome').on('value',function(snapshot){

			snapshot.forEach(function(dado){

			novoElementoTR = document.createElement('tr'); 

			dados('novoNomeTD',dado.val().nome,novoElementoTR);
			dados('novoEmailTD',dado.val().email,novoElementoTR);
			dados('novoTelefoneTD',dado.val().telefone,novoElementoTR);

			botoes('novoEditarTD','botaoEditar','btn-success','edit','editar',dado.key)
			botoes('novoExcluirTD','botaoExcluir','btn-danger','excluir','excluir',dado.key)

			tabel.appendChild(novoElementoTR);

		});	

		table.style.display = 'none';
		
		setTimeout(function(){
			load.style.display = 'none';
		},700);
		setTimeout(function(){
			table.style.display = 'block';
		},701);
			
			resolve();
		});
			
	});
}

enviar.addEventListener('click',function(){	
	dbRef.push({
		nome: nome.value, 
		email: email.value, 
		telefone: telefone.value
	});

	nome.value = ''; 
	email.value =  '';
	telefone.value = '';

	load.style.display = 'block';

	carregaUsuarios().then(function(){
		addListeners();

	},function(e){
		console.log(e);
	});
});


function addListeners() {
	document.querySelectorAll(".edit").forEach(function(elem) {
		elem.addEventListener("click", function() {
			editt.style.display = 'block';
			editar.style.display = 'block';
			cancelar.style.display = 'block';
			enviar.style.display = 'none';
			nome.value = elem.parentNode.parentNode.childNodes[0].innerHTML; 
			email.value =  elem.parentNode.parentNode.childNodes[1].innerHTML;
			telefone.value = elem.parentNode.parentNode.childNodes[2].innerHTML;
			key = elem.parentNode.parentNode.childNodes[3].childNodes[0].getAttribute('value');
		});
	});

	document.querySelectorAll(".excluir").forEach(function(elem) {
		elem.addEventListener("click", function() {
			console.log(elem.getAttribute('value'));

		});
	});	
}

cancelar.addEventListener('click',function(){
	editt.style.display = 'none';
	editar.style.display = 'none';
	cancelar.style.display = 'none';
	enviar.style.display = 'block';
	nome.value = ''; 
	email.value =  '';
	telefone.value = '';
	// corpo.style.overflow = 'visible';
});

editar.addEventListener('click',function(){
	var mudarDados = dbRef.child(key);
		mudarDados.update({
		"nome": nome.value,
		"email": email.value,
		"telefone": telefone.value
	});

	editt.style.display = 'none';
	editar.style.display = 'none';
	cancelar.style.display = 'none';
	enviar.style.display = 'block';
	nome.value = ''; 
	email.value =  '';
	telefone.value = '';
	load.style.display = 'block';
	carregaUsuarios().then(function(){
		addListeners();

	},function(e){
		console.log(e);
	});

});


