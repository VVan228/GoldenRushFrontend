$(document).ready(function() {
    ymaps.ready(init);

    function init() {
        // Создание карты.
        var myMap = new ymaps.Map("map", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [55.76, 37.64],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 7
        });
    }


    trucks = [{
            "id": 1,
            "busy": [
                0, 1, 2, 12, 13,
                16, 17, 18
            ]
        },
        {
            "id": 2,
            "busy": [
                14, 15, 16, 17, 18
            ]
        },
        {
            "id": 3,
            "busy": []
        },
        {
            "id": 4,
            "busy": [
                10, 11, 12, 13,
                16, 17, 18
            ]
        },
        {
            "id": 5,
            "busy": [
                10, 11,
                14, 15, 16
            ]
        },
        {
            "id": 6,
            "busy": [
                12, 13,
                16, 17, 18
            ]
        },
        {
            "id": 7,
            "busy": [
                12, 13, 14, 15
            ]
        },
        {
            "id": 8,
            "busy": [
                10, 11, 12
            ]
        },
    ]


    $("#busy-table").html(drawBusy(trucks));

    function drawBusy(trucks) {
        let table = "<table class='table table-borderless'>"
        table += "<tr>"
        for (let i = 0; i < 24; i++) { table += `<td>${i}</td>` }
        table += "</tr>"
        $(trucks).each(function(index, value) {
            // Каждый новый грузовик
            table += "<tr>";
            for (let i = 0; i < 24; i++) {
                // Каждый час для грузовика
                table += "<td";
                if (!$.inArray(i, value.busy)) { table += " class='busy-cell'>" } else { table += ">"; }
                table += "1</td>";
            }
            table += "</tr>";
        });
        table += "</table>";
        return table;
    }

    function isHourBusy(truck, hour) {
        $(truck.busy).each(function(index, value) {
            console.log(value);
            if (value == hour) return true;
        })
        return false;
    }

})