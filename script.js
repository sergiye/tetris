
// Вначале задаем начальные значения данных

// Фигура S: массив из двух массивов с "квадратиками", каждый из квадратиков которых хранится в ассоциативном массиве (объекте)
// это относительные координаты квадратиков внутри фигуры
figuraS = [ [{top: 0, left: 0}, {top: 1, left: 0}, {top: 1, left: 1}, {top: 2, left: 1}],
			[{top: 1, left: 0}, {top: 1, left: 1}, {top: 0, left: 1}, {top: 0, left: 2}] ];
// Фигура T: первый массив - это стартовый вид фигуры, второй массив - вид после "вращения"
figuraT = [ [{top: 0, left: 0}, {top: 1, left: 0}, {top: 1, left: 1}, {top: 2, left: 0}],
			[{top: 1, left: 0}, {top: 1, left: 1}, {top: 0, left: 1}, {top: 1, left: 2}] ];
// записываем первоначальный внешний вид в переменную активной фигуры
figura = figuraS[0];
// запоминаем тип фигуры
tipFigurki = 's';
// задаем первоначальное положение фигурки в ассоциативный массив (объект)
poziciaFigurki = {top: 0, left: 0};
// готовим пустой массив для хранения квадратиков упавших фигур
upavshieKubiki = [];

// Задаем действия в программе

// Запуск функции startProgram в момент после полной загрузки веб-страницы (т.е. нашего документа с игрой)
window.onload = startProgram;

// стартовая функция
function startProgram(){
	// запускаем падение фигурки каждую секунду
	setInterval(padenieFigurki, 1000);

	// при нажатии кнопок клавиатуры, запускаем программу keyProgram
	window.onkeydown = keyProgram;
}

// функция падения фигуры
function padenieFigurki(){
	// вначале проверим не находится ли фигура уже в самом низу
	upalaLiFigura();
	// сдвигаем по оси Y на 1
	sdvigFigurki(0, 1);
}

// функция реагирует на нажатия клавиатуры
// в эту функцию автоматически передаются данные о нажатии в переменную 'e'
function keyProgram(e){

	// вверх
    if (e.keyCode == 38){
    	// при нажатии крутим
    	krutim();
    }

	// вниз
    if (e.keyCode == 40){
    	// сдвигаем вниз
    	sdvigFigurki(0, 1)
    }

	// влево
    if (e.keyCode == 37){
    	// сдвигаем на оси Х
    	sdvigFigurki(-1, 0)
    }

	// вправо
    if (e.keyCode == 39){
    	sdvigFigurki(1, 0)
    }

	// пробел
    if (e.keyCode == 32 || e.charCode == 32){
    	console.log('Нажата кнопка "пробел"');
    }
    //console.log(e)
}
// функция вращения фигуры
function krutim(){
	// скрываем фигуру перед изменением внешнего вида
	skrytFiguru();

	// проверяем тип фигуры (может быть s или t)
	if(tipFigurki == 's'){
		// записываем в переменную второй массив квадратиков
		figura = figuraS[1];
		// с новыми координатами элементов фигурки проверяем не залезает ли она на стенки или другие квадраты
		if(!mestoSvobodno()){
			// и если место для вращения не свободно, возвращаем первый массив квадратиков
			figura = figuraS[0];
		}
	} else {
		// аналогичный код для фигуры типа t
		figura = figuraT[1];
		if(!mestoSvobodno()){
			figura = figuraT[0];
		}	
	}
	// а теперь показываем фигуру
	pokazatFiguru();
};

// функция для перемещения игрока по полю
function sdvigFigurki(x, y){
	// скрываем фигуру
	skrytFiguru();
	// сдвигаем позицию фигуры согласно параметрам x и y
	poziciaFigurki.top += y;
	poziciaFigurki.left += x;
	// с новыми координатами проверяем свободно ли место
	if(!mestoSvobodno()){
		// если нет - возвращаем координаты обратно
		poziciaFigurki.top -= y;
		poziciaFigurki.left -= x;
	}
	// и показываем фигуру
	pokazatFiguru();
};

// функция для проверки свободно ли место для фигурки
// возвращает true, если свободно
// false, если занято
function mestoSvobodno(){
	// перебираем циклически все квадратики в активной фигуре
	// kvadratik хранит индекс объекта с координатами квадратика 
	for(kvadratik in figura){
		// если вылезает справа или слева
		// для получения реальной позиции квадратика складываем позицию фигуры с позицией квадрата внутри фигуры
		// и эту сумму уже сравниваем с границами поля
		if(poziciaFigurki.left + figura[kvadratik].left < 0 || poziciaFigurki.left + figura[kvadratik].left > 5 ){
			// возвращаем "ложь"
			return false;
		};

		// если квадратик фигурки ниже поля
		if (poziciaFigurki.top + figura[kvadratik].top > 8){
			// после срабатывания команды return функция останавливается и возвращает значение (ложь)
			return false
		};

		// теперь сравним с каждым квадратиком из массива упавших квадратиков
		for(kvadr in upavshieKubiki){
			// для совпадения и top и left квадратика фигурки должны совпадать с квадратиком из упавших
			if( poziciaFigurki.top + figura[kvadratik].top == upavshieKubiki[kvadr].top && poziciaFigurki.left + figura[kvadratik].left == upavshieKubiki[kvadr].left){
				return false
			}
		};

	};
	// если ни одна проверка выше не сработала, возвращаем "истину" - место свободно
	return true
}

// функция проверяет упала ли фигура
function upalaLiFigura(){
	// вначале считаем что не упала
	// переменная нужна для того, чтобы дождаться завершения всех циклов проверки и только потом что-то предпринимать
	upala = false;
	// перебираем элементы активной фигуры
	for(kvadratik in figura){
		// к позиции квадратика добавляем единицу (проверка позиции под фигурой)
		if (poziciaFigurki.top + figura[kvadratik].top + 1 > 8){
			upala = true;
		};
		// перебираем упавшие кубики
		for(kvadr in upavshieKubiki){
			// опять сравниваем на позицию ниже
			if( poziciaFigurki.top + figura[kvadratik].top + 1 == upavshieKubiki[kvadr].top && poziciaFigurki.left + figura[kvadratik].left == upavshieKubiki[kvadr].left ){
				upala = true;
			}
		};

	};
	// если проверка показала, что под фигуркой место не свободно
	if(upala){
		// копируем квадратики упавшей фигуры в массив упавших квадратиков
		soedinitFiguruSUpavshimi();
		// запускаем сверху следующую фигуру
		next();
	}
}
// добавление фигуры к упавшим квадратам
function soedinitFiguruSUpavshimi(){
	// перебираем каждый квадратик упавшей фигуры
	for(kvadratik in figura){
		// добавляем в массив новый ассоциативный массив
		// координаты top и left вычисляются сложением позиции фигуры с позицией конкретного квадратика
		upavshieKubiki.push({top: figura[kvadratik].top + poziciaFigurki.top, left: figura[kvadratik].left + poziciaFigurki.left})
	};
}

function next(){
	// если функция показа следующей фигуры запустилась, когда фигура еще находится на нулевой позиции
	if(poziciaFigurki.top == 0){
		alert('Game over!');
	}
	// обнуляем позицию фигурки 
	poziciaFigurki = {top: 0, left: 0};
	// если была s, уставновим фигурку типа t
	if(tipFigurki == 's'){
		figura = figuraT[0];
		// и запоминаем в переменной
		tipFigurki = 't';
	} else {
		// в ином случае ставим фигурку типа s
		figura = figuraS[0];
		tipFigurki = 's';
	}
	// проверим появились ли сплошные линии
	udalimLinii();
}

function skrytFiguru(){
	// перебираем квадратики
	for(kvadratik in figura){
		// вычисляем id html-элемента
		// реальная позиция квадратика - это сложение его относительной позиции с позицией фигуры
		id_kvadratika = 'id_kvadratik_'+(figura[kvadratik].top + poziciaFigurki.top)+(figura[kvadratik].left + poziciaFigurki.left);
		// красим элемент в серый цвет
		document.getElementById(id_kvadratika).style.background = 'gray';

	};
}

function pokazatFiguru(){
	for(kvadratik in figura){
		id_kvadratika = 'id_kvadratik_'+(figura[kvadratik].top + poziciaFigurki.top)+(figura[kvadratik].left + poziciaFigurki.left);
		document.getElementById(id_kvadratika).style.background = 'orange';
	};
}
function skrytUpavshieKubiki(){
	for(kvadratik in upavshieKubiki){
		// у упавших квадратиков позиции в вычислении не нуждаются
		// просто подставляем координаты
		id_kvadratika = 'id_kvadratik_'+upavshieKubiki[kvadratik].top + upavshieKubiki[kvadratik].left;
		document.getElementById(id_kvadratika).style.background = 'gray';
	};
}

function pokazatUpavshieKubiki(){
	for(kvadratik in upavshieKubiki){
		id_kvadratika = 'id_kvadratik_'+upavshieKubiki[kvadratik].top + upavshieKubiki[kvadratik].left;
		document.getElementById(id_kvadratika).style.background = 'orange';
	};
}

// самая сложная функция в программе
// если в упавших квадратиках есть сплошные линии, их надо удалить
function udalimLinii(){
	skrytUpavshieKubiki();
	// перебираем линии нашего поля, начиная снизу
	for(x = 8; x > 0; x--){
		// в этой переменной будем хранить количество найденных квадратиков
		kvadratovVStroke = 0;
		// перебираем
		for(kvadratik in upavshieKubiki){
			// если квадратик по высоте находится на данной линии, посчитаем его
			if(upavshieKubiki[kvadratik].top == x){
				kvadratovVStroke++;
			}
		};
		// если в строке нашлось 6 квадратов, значит линия сплошная
		if(kvadratovVStroke == 6){
			// сохраним во временный массив результат фильтрации упавших кубиков
			// в этот массив не попадут квадратики из этой сплошной линии 
			massiv = upavshieKubiki.filter(function(kvadrat){
				if(kvadrat.top == x){
					return false
				}
				return true
			});
			// записываем в упавшие квадраты результат фильтрации
			upavshieKubiki = massiv;
			// теперь надо сдвинуть все квадратики выше линии вниз на один шаг
			// перебираем каждый
			for(kvadratik in upavshieKubiki){
				// если координата квадрата выше удаленной линии, сдвигаем его вниз
				if(upavshieKubiki[kvadratik].top < x){
					upavshieKubiki[kvadratik].top++;
				}
			};
			// а раз мы сдвинули все квадратики на один шаг вниз
			// то эту линию надо снова проверить, не сплошная ли она
			// отматываем счетчик на шаг назад
			x++;
		};
	};

	pokazatUpavshieKubiki();
};



