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
let pesquisar = document.querySelector('.pesquisar');
let pesquisarNome = document.querySelector('.pesquisarNome');
let pesquisaCancela = document.querySelector('.pesquisaCancela');
let key;
let usuarioInvalido= document.querySelector('.usuarioInvalido');
let emailInvalido= document.querySelector('.emailInvalido');
let telefoneInvalido= document.querySelector('.telefoneInvalido');



window.onload = function (){
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

function validate(){

	var truee = true;
	if(nome.value==''){
		usuarioInvalido.innerHTML = 'O campo de usuario não pode estar vazio';
		usuarioInvalido.style.display = 'block';
		truee =  false;
	}else if(nome.value.length<5){
		usuarioInvalido.innerHTML = 'O campo de usuario deve possuir no minimo 5 caracteres';
		usuarioInvalido.style.display = 'block';
		truee =  false;
	}else{
		usuarioInvalido.style.display = 'none';
	}


	var usuario = email.value.substring(0, email.value.indexOf("@"));
	var dominio = email.value.substring(email.value.indexOf("@")+ 1, email.value.length);

	if(email.value==''){
		emailInvalido.innerHTML = 'O campo de email não pode estar vazio';
		emailInvalido.style.display = 'block';
		truee =  false;
	}else if((usuario.length >=1) &&
    (dominio.length >=3) &&
    (usuario.search("@")==-1) &&
    (dominio.search("@")==-1) &&
    (usuario.search(" ")==-1) &&
    (dominio.search(" ")==-1) &&
    (dominio.search(".")!=-1) &&
    (dominio.indexOf(".") >=1)&&
    (dominio.lastIndexOf(".") < dominio.length - 1)){
    	emailInvalido.style.display = 'none';
	}else{
		emailInvalido.innerHTML = 'Por favor insira um email valido';
		emailInvalido.style.display = 'block';
		truee =  false;
	}

	if(telefone.value==''){
		telefoneInvalido.innerHTML = 'O campo de telefone não pode estar vazio';
		telefoneInvalido.style.display = 'block';
		truee =  false;
	}else if(telefone.value.length<8||telefone.value.length>9){
		telefoneInvalido.innerHTML = 'O campo de telefone deve ser preenchido com  8 ou 9 digitos';
		telefoneInvalido.style.display = 'block';
		truee =  false;
	}else{
		telefoneInvalido.style.display = 'none';
	}

	if (truee == false){
		return false;
	}else{
		return true;
	}
}

enviar.addEventListener('click',function(){
	var validade = validate();
	if(validade==false){
		return false;
	}

	dbRef.push({
		nome: nome.value, 
		email: email.value, 
		telefone: telefone.value
	});

	nome.value = ''; 
	email.value =  '';
	telefone.value = '';

	load.style.display = 'flex';

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
			editar.style.display = 'inline';
			cancelar.style.display = 'inline';
			enviar.style.display = 'none';
			nome.value = elem.parentNode.parentNode.childNodes[0].innerHTML; 
			email.value =  elem.parentNode.parentNode.childNodes[1].innerHTML;
			telefone.value = elem.parentNode.parentNode.childNodes[2].innerHTML;
			key = elem.parentNode.parentNode.childNodes[3].childNodes[0].getAttribute('value');
		});
	});

	document.querySelectorAll(".excluir").forEach(function(elem) {
		elem.addEventListener("click", function() {
				resp = confirm("Deseja excluir?");
				if (resp==true){
					dbRef.child(elem.getAttribute('value')).remove();


					load.style.display = 'flex';
					carregaUsuarios().then(function(){
						addListeners();

					},function(e){
						console.log(e);
					});
				}else{ 
				  	return false;
				}
		});
	});	
}

cancelar.addEventListener('click',function(){
	editt.style.display = 'none';
	editar.style.display = 'none';
	cancelar.style.display = 'none';
	enviar.style.display = 'inline';
	nome.value = ''; 
	email.value =  '';
	telefone.value = '';
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
	enviar.style.display = 'inline';
	nome.value = ''; 
	email.value =  '';
	telefone.value = '';
	load.style.display = 'flex';
	carregaUsuarios().then(function(){
		addListeners();

	},function(e){
		console.log(e);
	});

});


function CarregaPesquisa(snap){
	return new Promise(function(resolve, reject){
	tabel.innerHTML = '';
						
	novoElementoTR = document.createElement('tr'); 

	dados('novoNomeTD',snap.val().nome,novoElementoTR);
	dados('novoEmailTD',snap.val().email,novoElementoTR);
	dados('novoTelefoneTD',snap.val().telefone,novoElementoTR);

	botoes('novoEditarTD','botaoEditar','btn-success','edit','editar',snap.key);
	botoes('novoExcluirTD','botaoExcluir','btn-danger','excluir','excluir',snap.key);

	tabel.appendChild(novoElementoTR);

	table.style.display = 'none';
	load.style.display = 'flex';
	setTimeout(function(){
		load.style.display = 'none';
	},700);
	setTimeout(function(){
		table.style.display = 'block';
	},701);	
	resolve();	
	});
}

pesquisar.addEventListener('click',function(){
	dbRef.orderByChild('nome').equalTo(pesquisarNome.value).on('value',function(snapshot) { //endAt(`${pesquisarNome.value}\uf8ff`)
			snapshot.forEach(function(snap){
				// console.log(snap.val().nome);
				CarregaPesquisa(snap).then(function(){
				addListeners();

				},function(e){
					console.log(e);
				});
						
			});	
		}
	);
	pesquisarNome.value = '';
});


pesquisaCancela.addEventListener('click',function(){
	if(pesquisarNome.value!=''){
		pesquisarNome.value = '';
		load.style.display = 'flex';
		carregaUsuarios().then(function(){
			addListeners();

		},function(e){
			console.log(e);
		});
	}	
});


