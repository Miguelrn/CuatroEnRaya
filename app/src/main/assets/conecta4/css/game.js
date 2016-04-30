var JUGADOR = { HUMANO:1, CPU:2 };
var ESTADO = { JUGANDO: 0, ESPERANDO: 1, TERMINADO:2 };
var N = 6;// numero filas
var M = 8;//numero columnas

function Tablero(){
	this.panel=[];

	this.celdas=[];
	for (var i=0;i<N*M;i++)
	{
		this.celdas[i]=document.getElementById("celda"+i);
	}
}

Tablero.prototype.clone = function(panel){
	var n = panel.length;
	
	for(var i = 0; i < n ; i++)
		this.panel[i] = panel[i];
}

//ponemos todas las casillas en blanco
Tablero.prototype.reset=function(){
	for(var i = 0; i < N*M; i++){	
		this.panel[i] = 0;
	}
};

//esta la casilla vacia??
 Tablero.prototype.marcable=function(posicion){
	return (this.panel[posicion]==0);//hay una posicion libre en la columna
};

//marcamos la posicion del que acaba de jugar
Tablero.prototype.marcar=function(turno,posicion){
	//this.panel[posicion]=turno;
	var fila;
	for(var i = 0; i < N; i++){//fila
		if(this.panel[posicion+i*M] == 0) fila = i;
	}
	this.panel[posicion+fila*M] = turno;
};

//para saber si el jugardor ha ganado(comprobamos todas las combinaciones posibles)
 Tablero.prototype.esGanador=function(jugador){
	//Horizontal
	var bool;
	for(var i = 0; (i < N); i++){//filas
		for(var j = 0; j < (M-3); j++){//columnas
			bool = bool || (this.panel[i*M+j] == jugador && this.panel[i*M+j+1] == jugador && this.panel[i*M+j+2]==jugador && this.panel[i*M+j+3]==jugador);
		}
	}
	
	//vertical
	for(var i = 0; i < (N-3); i++){//colmunas
		for(var j = 0; j < M; j++){//filas
			bool = bool || (this.panel[i*M+j] == jugador && this.panel[i*M+j+1*M] == jugador && this.panel[i*M+j+2*M]==jugador && this.panel[i*M+j+3*M]==jugador);
		}
	}
	
	//diagonal derecha
	for(var i = 0; i < (N-3); i++){//colmunas
		for(var j = 0; j < (M-3); j++){//filas
			bool = bool || (this.panel[i*M+j] == jugador && this.panel[i*M+j+1*M+1] == jugador && this.panel[i*M+j+2*M+2]==jugador && this.panel[i*M+j+3*M+3]==jugador);
		}
	}
	
	//diagonal izquierda
	for(var i = 0; i < (N-3); i++){//colmunas
		for(var j = 3; j < (M); j++){//filas
			bool = bool || (this.panel[i*M+j] == jugador && this.panel[i*M+j+1*M-1] == jugador && this.panel[i*M+j+2*M-2]==jugador && this.panel[i*M+j+3*M-3]==jugador);
		}
	}
	
	return bool;
};

//comprobamos si quedan casillas sin jugar
Tablero.prototype.celdasVacias=function(){
	var n=this.panel.length;
	for (var i=0;i<n;i++){
		if (this.panel[i]==0){
			return true;//puede continuar, hay almenos una vacia
		}
	}
	return false;
};

//pintar los circulos del color del jugador, blanco si no hay fichas
Tablero.prototype.pintaFicha=function(i,color){
	var c = document.getElementById("celda"+i);	
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.arc(150,75,55,0,2*Math.PI);//x,y,radio,¿?
	ctx.fillStyle = color;
    ctx.fill();
	
}

//pintamos las casillas
Tablero.prototype.dibujar=function(){
	//var n=this.panel.length;

	for (var i=0;i<N*M;i++){
		if (this.panel[i]==0){
			this.pintaFicha(i,'#FFFFFF');
		}
		else{
			if (this.panel[i]==JUGADOR.HUMANO){
				this.pintaFicha(i,'#69CC69');
			}
			else{
				this.pintaFicha(i,'#FF6666');
			}
		}	
	}
};

function Juego(){
	this.partidas=0;
	this.tablero=new Tablero();
	this.estado=null;
	this.consola=document.getElementById("consola");

	this.reset();
}

Juego.prototype.reset=function(){
	this.tablero.reset();
	if (this.partidas%2==1)
	{
		this.estado=ESTADO.ESPERANDO;
		this.mostrarMensaje("Turno del jugador 2","blue");
		this.movimientoAI
		//this.tablero.marcar(JUGADOR.CPU,Math.floor(Math.random() * M));
	}
	this.partidas++;
	this.estado=ESTADO.JUGANDO;
	this.mostrarMensaje("Turno del jugador 1","red");
	this.tablero.dibujar();
};

Juego.prototype.mostrarMensaje=function(mensaje,color){
	this.consola.innerHTML='<span style="color:'+color+';">'+mensaje+'</span>';
	//alert(mensaje);
};

Juego.prototype.logica=function(posicion){
	var x = posicion%M;
	if (this.estado==ESTADO.JUGANDO){ // se pone Estado Terminado cuando gana uno de los 2 o no quedan casillas vacias
		if (this.tablero.marcable(x)) {//es la casilla que se acaba de pulsar vacia ¿?
		//console.log("pos: "+posicion);
			this.tablero.marcar(JUGADOR.HUMANO,x);//marca la posicion que pulso el jugador humano, a continuacion se vera si puede jugar el pc
			
			//this.tablero.limpia(JUGADOR.HUMANO);

			if (this.tablero.esGanador(JUGADOR.HUMANO)){ // solo cuando encuentra convinacionde 4 elementos en linea. comprueba las 3 formas
				this.estado=ESTADO.TERMINADO;
				this.mostrarMensaje("¡HAS GANADO! </br> Click en una celda para comenzar de nuevo.","red");
			}
			else if (!this.tablero.celdasVacias()) // devuelve true si hay casillas vacias -> !true = false por tanto no entra
			{
				this.estado=ESTADO.TERMINADO;
				this.mostrarMensaje("¡EMPATE! </br> Click en una celda para comenzar de nuevo.","orange");
			}
			else//
			{
				this.estado==ESTADO.ESPERANDO;
				this.mostrarMensaje("Turno de AI...","blue");
				this.movimientoAI();
				//this.tablero.limpia(JUGADOR.CPU);

				if (this.tablero.esGanador(JUGADOR.CPU))
				{
					this.estado=ESTADO.TERMINADO;
					this.mostrarMensaje("¡AI GANA! </br> Click en una celda para comenzar de nuevo.","blue");
				}
				else if (!this.tablero.celdasVacias())
				{
					this.estado=ESTADO.TERMINADO;
					this.mostrarMensaje("¡EMPATE! </br> Click en una celda para comenzar de nuevo.","orange");
				}
				else
				{
					this.mostrarMensaje("Turno del jugador 1","red");
					this.estado==ESTADO.JUGANDO;
				}
			}
		}
		this.tablero.dibujar();
	}
	else if (this.estado==ESTADO.TERMINADO)
	{
		this.reset();
	}
};

 Juego.prototype.movimientoAI=function(){
	var posicion=0;
	var niveles=5;//no necesito bajar mas niveles para ganar al usuario XD
	//var n=this.tablero.panel.length;
	var aux;
	var a = -99999, b = 99999;
	
		
	
	for (var i=0;i<M;i++)
	{
		var tabAux = new Tablero();
		tabAux.clone(this.tablero.panel);
		if (tabAux.marcable(i))
		{
			tabAux.marcar(JUGADOR.CPU,i);
			aux=this.min(tabAux, niveles, a, b);
			if (aux>a)
			{
				a=aux;
				posicion=i;
			}
			//tabAux.marcar(0,i);
		}
		delete tabAux;
	}
	console.log("pos AI: "+posicion);

	this.tablero.marcar(JUGADOR.CPU,posicion);
};

Juego.prototype.CalculaValor=function(casilla1, casilla2, casilla3, casilla4){//dadas 4 casillas, devolvera el valor relacionado a estas
	var jug1 = 0, jug2 = 0;
	if(casilla1 == 1) jug1++; else if(casilla1 == 2) jug2++;
	if(casilla2 == 1) jug1++; else if(casilla2 == 2) jug2++;
	if(casilla3 == 1) jug1++; else if(casilla3 == 2) jug2++;
	if(casilla4 == 1) jug1++; else if(casilla4 == 2) jug2++;
	
	//console.log("jug1: "+jug1+" jug2: "+jug2);

	
	if(jug1 != 0 && jug2 != 0){//hay casillas de ambos colores ninguno puede ganar
		return 0;
	}
	else if(jug1 != 0 || jug2 != 0){//hay alguna casilla de un jugador
		if(jug1 != 0) return -(Math.pow(10,jug1));//hay casillas del jugador 1
		else 		  return (Math.pow(10,jug2));
	}
	else return 0;//las 4 casillas estan en blanco
	
}

Juego.prototype.Heuristica=function(tableroAux){//esta funcion pretende calcular cual es la mejor jugada
	//var n=tableroAux.panel.length;
	//horizontal
	//console.log("el valor en Heuristica de panel : "+tableroAux);
	//console.log("Heuristica tabla de valores: "+tableroAux.panel[0]+","+tableroAux.panel[1]+","+tableroAux.panel[2]+","+tableroAux.panel[3]+","+tableroAux.panel[4]+","+tableroAux.panel[5]+","+tableroAux.panel[6]+","+tableroAux.panel[7]+","+tableroAux.panel[8]+","+tableroAux.panel[9]+","+tableroAux.panel[10]+","+tableroAux.panel[11]+","+tableroAux.panel[12]+","+tableroAux.panel[13]+","+tableroAux.panel[14]+","+tableroAux.panel[15]);
	var valor= 0;


	for(var i = 0; (i < N); i++){//filas
		for(var j = 0; j < (M-3); j++){//columnas
			valor += this.CalculaValor(tableroAux.panel[i*M+j], tableroAux.panel[i*M+j+1], tableroAux.panel[i*M+j+2], tableroAux.panel[i*M+j+3]);	
		}
	}
	
	//vertical
	for(var i = 0; i < (N-3); i++){//colmunas
		for(var j = 0; j < M; j++){//filas
			valor += this.CalculaValor(tableroAux.panel[i*M+j], tableroAux.panel[i*M+j+1*M], tableroAux.panel[i*M+j+2*M], tableroAux.panel[i*M+j+3*M]);
		}
	}
	
	//diagonal derecha
	for(var i = 0; i < (N-3); i++){//colmunas
		for(var j = 0; j < (M-3); j++){//filas
			valor += this.CalculaValor(tableroAux.panel[i*M+j], tableroAux.panel[i*M+j+1*M+1], tableroAux.panel[i*M+j+2*M+2], tableroAux.panel[i*M+j+3*M+3]);
		}
	}
	
	//diagonal izquierda
	for(var i = 0; i < (N-3); i++){//colmunas
		for(var j = 3; j < (M); j++){//filas
			valor += this.CalculaValor(tableroAux.panel[i*M+j], tableroAux.panel[i*M+j+1*M-1], tableroAux.panel[i*M+j+2*M-2], tableroAux.panel[i*M+j+3*M-3]);
		}
	}
	//console.log("Heuristica -> valor: "+valor);
	
	return valor;
}

 Juego.prototype.min=function(tabAux, niveles, a, b){
	//if (this.tablero.esGanador(JUGADOR.CPU)) return 1;
	//if (!this.tablero.celdasVacias()) return 0;
	//var n=tabAux.panel.length;//this.tablero.panel.length;
	niveles--;
	
	var aux;//,mejor=9999;

	if(!tabAux.celdasVacias() || !niveles){//
		//meterle la Heuristica para que frene !
		//console.log("ha entrado en MIN: "+niveles);
		return this.Heuristica(tabAux);
	}
	else{

		for (var i=0;i<M;i++)
		{
			var tableroAux = new Tablero();
			tableroAux.clone(tabAux.panel);
						
			if (tableroAux.marcable(i))
			{
				tableroAux.marcar(JUGADOR.HUMANO,i);
				aux=this.max(tableroAux, niveles, a, b);
				//B = minimo(aux,b);
				if(aux < b){
					b = aux;
				}
				if(a >= b){
					//delete game;
					//return B;
				}
				//tableroAux.marcar(0,i);
			}
			delete tableroAux;
		}
		return b;
	}
	//return mejor;
};


Juego.prototype.max=function(tabAux, niveles, a, b){
	//if (this.tablero.esGanador(JUGADOR.HUMANO)) return -1;
	//if (!this.tablero.celdasVacias()) return 0;
	
	//var n=tabAux.panel.length;//this.tablero.panel.length;

	
	var aux;//,mejor=-9999;
	niveles--;
	if(!tabAux.celdasVacias() || !niveles){
		return this.Heuristica(tabAux);
	}
	else{
		for (var i=0;i<M;i++)
		{
			var tableroAux = new Tablero();
			tableroAux.clone(tabAux.panel);
			if (tableroAux.marcable(i))
			{
				tableroAux.marcar(JUGADOR.CPU,i);
				aux=this.min(tableroAux, niveles, a, b);
				//A = maximo(aux,A);
				if(aux > a){
					a = aux;
				}
				if(a >= b){
					//delete game;
					//return A;
				}
				//tableroAux.marcar(0,i);		
			}
			delete tableroAux;
		}
		return a;
	}
	//return mejor;
};

