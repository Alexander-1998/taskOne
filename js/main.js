window.addEventListener('load', async () => {

    async function getResponse() {
        let response = await fetch('http://contest.elecard.ru/frontend_data/catalog.json');
        return await response.json();
    }

    //Пагинация 
    let paginations = document.querySelector('.pagination');

    let noteOnePage = 30;
    let page = 1;
    let numberOfHemp = 5;
    /*Данное условие проверяет разрешение экрана и 
    устанавливает кол-во кнопок будет отброжаться в пагинации */
    let screenSize = screen.width;
    if(screenSize <= 425){
        numberOfHemp = 2;
    }
    console.log(screenSize);

    //Функция принимает объект, страницу и колличество элементов на одной странице
    function pagination(obj, page, noteOnePage) {

        let start = (page - 1) * noteOnePage;
        let end = start + noteOnePage;

        let trimmedObject = obj.slice(start, end);

        let pages = Math.ceil(obj.length / noteOnePage);




        return {
            'trimmedObj': trimmedObject,
            'pages': pages,
        }
    }


    /*Функция принимает количество страниц которые возвращает функция pagination
    и объект который выводится */


    function pageButtons(pages, obj) {

        paginations.innerHTML = '';

        let maxLeft = page - Math.floor(numberOfHemp / 2);
        let maxRight = page + Math.floor(numberOfHemp / 2);

        if (maxLeft < 1) {
            maxLeft = 1;
            maxRight = numberOfHemp;
        }

        if (maxRight > pages) {
            maxLeft = pages - (numberOfHemp - 1);

            maxRight = pages;

            if (maxLeft < 1) {
                maxLeft = 1;
            }
        }

        if (page != 1) {
            paginations.innerHTML += `<button class="pageNum" value="${1}">&#171; First</button>` + paginations.innerHTML;
        }

        for (let i = maxLeft; i <= maxRight; i++) {
            paginations.innerHTML += `<button class="pageNum" value="${i}">${i}</button>`

        }

        if (page != pages) {
            paginations.innerHTML = paginations.innerHTML + `<button class="pageNum" value="${pages}">Last &#187;</button>`;
        }

        let pageNum = document.querySelectorAll('.pageNum');


        pageNum.forEach(item => {
            item.addEventListener('click', () => {

                page = Number(item.value);
                showContent(obj);
            });
        });


        // Работа с localStorage
        let closeBtn = document.querySelectorAll('.close');
        closeBtn.forEach(close => {
            close.addEventListener('click', () => {
                let parent = close.parentNode;
                let id = parent.dataset['id'];

                localStorage.setItem(`${id}`, `${parent}`);

                // parent.classList.add('hide');
                parent.style.display = 'none';

            });
        });

    }



    //jsonContent это общий полный объект 
    let jsonContent = await getResponse();


    //sortedByDate это отсортированный объект по дате 
    let sortedByDate = JSON.parse(JSON.stringify(jsonContent));
    sortedByDate = sortedByDate.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);

    let byDate = document.querySelector('.byDate');

    byDate.addEventListener('click', () => {
        showContent(sortedByDate);
    });


    //sortedByDate это отсортированный объект по размеру
    let sortedByFileSize = JSON.parse(JSON.stringify(jsonContent));
    sortedByFileSize = sortedByFileSize.sort((a, b) => a.filesize > b.filesize ? 1 : -1);

    let byAscent = document.querySelector('.byAscent');

    byAscent.addEventListener('click', () => {
        showContent(sortedByFileSize);
    });


    //sortedByCategory это отсортированный объект по категории
    let sortedByCategoryBtn = document.querySelectorAll('.sortedByCategory');

    sortedByCategoryBtn.forEach(radio => {
        radio.addEventListener('click', () => {
            let sortedByCategory = JSON.parse(JSON.stringify(jsonContent));
            let radioValue = radio.value;
            var newObjSortedByCategory = [];
            for (let key in sortedByCategory) {
                if (radioValue === sortedByCategory[key].category) {
                    newObjSortedByCategory.push(sortedByCategory[key]);
                }
            }
            showContent(newObjSortedByCategory);
        });
    });


    //Вернуть все карточки
    document.querySelector('.standart').addEventListener('click', () => {
        showContent(jsonContent)
    });


    /*Данная функция отображает элементы в зависимости от 
    объекта который поступил в качестве параметра */

    let idCount = 0; // Формирует id карточки 

    showContent(jsonContent);

    function showContent(obj) {
        let data = pagination(obj, page, noteOnePage);

        let list = document.querySelector('.list');


        let myList = data.trimmedObj;

        list.innerHTML = '';
        for (const key in myList) {
            idCount++;
            let image = myList[key].image;

            let filesize = (myList[key].filesize / Math.pow(1024, 2)).toFixed(3);

            let timestamp = new Date(myList[key].timestamp);

            let timestampDay = timestamp.getDay(); //День

            if (timestampDay < 10) {
                timestampDay = '0' + timestampDay;
            }

            let timestampMonth = timestamp.getMonth(); //Месяц

            if (timestampMonth < 10) {
                timestampMonth = '0' + timestampMonth;
            }

            let timestampYears = timestamp.getFullYear(); // Год 
            let fullDate = timestampDay + ' . ' + timestampMonth + ' . ' + timestampYears;

            let category = myList[key].category;

            list.innerHTML += `
                        <li class="card" data-id="${idCount}">
                            <button class="close">X</button>
                            <image src="http://contest.elecard.ru/frontend_data/${image}" alt="${myList[key].category}">
                            <p>${filesize} мб</p>
                            <p>${fullDate}</p>
                            <p>${category}</p>
                        </li>
                    `;
        }

        pageButtons(data.pages, obj);
    }

    
});