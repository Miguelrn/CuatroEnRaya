var JUGADOR = { HUMANO:1, CPU:2 };
var ESTADO = { JUGANDO: 0, ESPERANDO: 1, TERMINADO:2 };

function Tablero(){
	this.panel=[];

	this.celdas=[];
	for (var i=0;i<16;i++)
	{
		this.celdas[i]=document.getElementById("celda"+(i+1));
	}
}

Tablero.prototype.clone = function(panel){
	var n = panel.length;
	//console.log("clone : n "+ n);
	
	for(var i = 0; i < n ; i++)
		this.panel[i] = panel[i];
}

//ponemos todas las casillas en blanco
Tablero.prototype.reset=function(){
	this.panel=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
};

//esta la casilla vacia??
 Tablero.prototype.marcable=function(posicion){
	return (this.panel[posicion]==0);
};

//marcamos la posicion del que acaba de jugar
Tablero.prototype.marcar=function(turno,posicion){
	this.panel[posicion]=turno;
};

//para saber si el jugardor ha ganado(comprobamos todas las combinaciones posibles)
 Tablero.prototype.esGanador=function(jugador){
	//Horizontal
	var bool = (this.panel[0] == jugador && this.panel[1] == jugador && this.panel[2]==jugador && this.panel[3]==jugador);
	bool = bool || (this.panel[4] == jugador && this.panel[5] == jugador && this.panel[6]==jugador && this.panel[7]==jugador);
	bool = bool || (this.panel[8] == jugador && this.panel[9] == jugador && this.panel[10]==jugador && this.panel[11]==jugador);
	bool = bool || (this.panel[12] == jugador && this.panel[13] == jugador && this.panel[14]==jugador && this.panel[15]==jugador);
	//vertical
	bool = bool || (this.panel[0] == jugador && this.panel[4] == jugador && this.panel[8]==jugador && this.panel[12]==jugador);
	bool=bool || (this.panel[1] == jugador && this.panel[5] == jugador && this.panel[9]==jugador && this.panel[13]==jugador);
	bool=bool || (this.panel[2] == jugador && this.panel[6] == jugador && this.panel[10]==jugador && this.panel[14]==jugador);
	bool=bool || (this.panel[3] == jugador && this.panel[7] == jugador && this.panel[11]==jugador && this.panel[15]==jugador);
	//diagonal
	bool=bool || (this.panel[0] == jugador && this.panel[5] == jugador && this.panel[10]==jugador && this.panel[15]==jugador);
	bool=bool || (this.panel[3] == jugador && this.panel[6] == jugador && this.panel[9]==jugador && this.panel[12]==jugador);
	return bool;
};

//comprobamos si quedan casillas sin jugar
Tablero.prototype.celdasVacias=function(){
	var n=this.panel.length;
	//console.log("celdas vacias -> numero de celdas = "+n);
	for (var i=0;i<n;i++){
		if (this.panel[i]==0){
			return true;//puede continuar, hay almenos una vacia
		}
	}
	return false;
};

//pintamos las casillas
Tablero.prototype.dibujar=function(){
	var n=this.panel.length;
	for (var i=0;i<n;i++){
		if (this.panel[i]==0){
			this.celdas[i].innerHTML='';
		}
		else{
			if (this.panel[i]==JUGADOR.HUMANO){
				this.celdas[i].innerHTML='<span style="color:red;">X</span>';
			}
			else{
				this.celdas[i].innerHTML='<span style="color:blue;">O</span>';
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
		this.tablero.marcar(JUGADOR.CPU,Math.floor(Math.random() * 16));
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
	if (this.estado==ESTADO.JUGANDO){ // se pone Estado Terminado cuando gana uno de los 2 o no quedan casillas vacias
		if (this.tablero.marcable(posicion)) {//es la casilla que se acaba de pulsar vacia ¿?
			this.tablero.marcar(JUGADOR.HUMANO,posicion);//marca la posicion que pulso el jugador humano, a continuacion se vera si puede jugar el pc

			if (this.tablero.esGanador(JUGADOR.HUMANO)){ // solo cuando encuentra convinacionde 4 elementos en linea. comprueba las 3 formas
				this.estado=ESTADO.TERMINADO;
				//this.tablero.dibujar();
				this.mostrarMensaje("¡HAS GANADO! </br> Click en una celda para comenzar de nuevo.","red");
			}
			else if (!this.tablero.celdasVacias()) // devuelve true si hay casillas vacias -> !true = false por tanto no entra
			{
				this.estado=ESTADO.TERMINADO;
				//this.tablero.dibujar();
				this.mostrarMensaje("¡EMPATE! </br> Click en una celda para comenzar de nuevo.","orange");
			}
			else//
			{
				this.estado==ESTADO.ESPERANDO;
				this.mostrarMensaje("Turno de AI...","blue");
				this.movimientoAI();

				if (this.tablero.esGanador(JUGADOR.CPU))
				{
					this.estado=ESTADO.TERMINADO;
					//this.tablero.dibujar();
					this.mostrarMensaje("¡AI GANA! </br> Click en una celda para comenzar de nuevo.","blue");
				}
				else if (!this.tablero.celdasVacias())
				{
					this.estado=ESTADO.TERMINADO;
					//this.tablero.dibujar();
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
	var niveles=1;//no necesito bajar mas niveles para ganar al usuario XD
	var n=this.tablero.panel.length;
	var aux, mejor=-9999;
	
	var tabAux = new Tablero();
	tabAux.clone(this.tablero.panel);	
	
	for (var i=0;i<n;i++)
	{
		if (tabAux.marcable(i))
		{
			tabAux.marcar(JUGADOR.CPU,i);
			aux=this.min(tabAux,niveles, mejor);
			if (aux>mejor)
			{
				mejor=aux;
				posicion=i;
			}
			tabAux.marcar(0,i);
		}
	}

	this.tablero.marcar(JUGADOR.CPU,posicion);
};

Juego.prototype.CalculaValor=function(casilla1, casilla2, casilla3, casilla4){//dadas 4 casillas, devolvera el valor relacionado a estas
	var jug1 = 0, jug2 = 0;
	if(casilla1 == 1) jug1++; else if(casilla1 == 2) jug2++;
	if(casilla2 == 1) jug1++; else if(casilla2 == 2) jug2++;
	if(casilla3 == 1) jug1++; else if(casilla3 == 2) jug2++;
	if(casilla4 == 1) jug1++; else if(casilla4 == 2) jug2++;
	
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
	var n=tableroAux.panel.length;
	//horizontal
	//console.log("el valor en Heuristica de panel, n: "+n);
	console.log("Heuristica tabla de valores: "+tableroAux.panel[0]+","+tableroAux.panel[1]+","+tableroAux.panel[2]+","+tableroAux.panel[3]+","+tableroAux.panel[4]+","+tableroAux.panel[5]+","+tableroAux.panel[6]+","+tableroAux.panel[7]+","+tableroAux.panel[8]+","+tableroAux.panel[9]+","+tableroAux.panel[10]+","+tableroAux.panel[11]+","+tableroAux.panel[12]+","+tableroAux.panel[13]+","+tableroAux.panel[14]+","+tableroAux.panel[15]);
	var valor= 0;
	for(var i = 0; i < n; i= i+4){
		valor += this.CalculaValor(tableroAux.panel[i],tableroAux.panel[i+1],tableroAux.panel[i+2],tableroAux.panel[i+3]);	
	}
	//vertical
	for(var i = 0; i < 4; i++){
		valor += this.CalculaValor(tableroAux.panel[i],tableroAux.panel[i+4],tableroAux.panel[i+8],tableroAux.panel[i+12]);
	}
	//diagonal der y izq solo hay una de cada
	valor += this.CalculaValor(tableroAux.panel[0],tableroAux.panel[5],tableroAux.panel[10],tableroAux.panel[15]);//diagonal principal
	valor += this.CalculaValor(tableroAux.panel[3],tableroAux.panel[6],tableroAux.panel[9],tableroAux.panel[12]);
	
	console.log("Heuristica -> valor: "+valor);
	
	return valor;
}

 Juego.prototype.min=function(tabAux, niveles, mejor){
	//if (this.tablero.esGanador(JUGADOR.CPU)) return 1;
	//if (!this.tablero.celdasVacias()) return 0;
	var n=tabAux.panel.length;//this.tablero.panel.length;
	var tableroAux = new Tablero();
	tableroAux.clone(tabAux.panel);
	
	var aux;//,mejor=9999;
	niveles--;
	if(!tableroAux.celdasVacias() || !niveles){//
		//meterle la Heuristica para que frene !
		//console.log("ha entrado en MIN: "+niveles);
		return this.Heuristica(tableroAux);
	}
	else{
		for (var i=0;i<n;i++)
		{
			if (tableroAux.marcable(i))
			{
				tableroAux.marcar(JUGADOR.HUMANO,i);
				aux=this.max(tableroAux, niveles, mejor);
				if (aux<mejor)
				{
					mejor=aux;
				}
				tableroAux.marcar(0,i);
			}
		}
	}
	//return mejor;
};


Juego.prototype.max=function(tabAux, niveles, mejor){
	//if (this.tablero.esGanador(JUGADOR.HUMANO)) return -1;
	//if (!this.tablero.celdasVacias()) return 0;
	
	var n=tabAux.panel.length;//this.tablero.panel.length;
	var tableroAux = new Tablero();
	tableroAux.clone(tabAux.panel);
	
	var aux;//,mejor=-9999;
	niveles--;
	if(!tableroAux.celdasVacias() || !niveles){
		return this.Heuristica(tableroAux);
	}
	else{
		for (var i=0;i<n;i++)
		{
			if (tableroAux.marcable(i))
			{
				tableroAux.marcar(JUGADOR.CPU,i);
				aux=this.min(tableroAux,niveles, mejor);
				if (aux>mejor)
				{
					mejor=aux;
				}
				tableroAux.marcar(0,i);
			}
		}
	}
	//return mejor;
};

