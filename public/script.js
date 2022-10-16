// МАША
// import "./auth";



$(document).ready(function() {

    
function getTransportTypes() {
    const transportTypesList = document.getElementById("transportType");
    const url = "http://192.168.0.100:8080/api/transport/type/getTypes";
    return fetchWithAuth(url, {}).then(function(response) {
        if (response.ok) {
            return response.json().then(function(jsonData) {
                console.log(jsonData);
                //запись полученных значений в select
                jsonData.forEach(function(type) {
                    let newOption = new Option(type["name"]);
                    newOption.setAttribute("id", type["id"]);
                    $("#transportType").append(newOption);
                });

            });
        } else {
            console.log('Network request for trasportTypes.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });
    // fetch(url, { headers: { "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYUBiYi5ydSIsInJvbGUiOiJTVVBFUlZJU09SIiwib3JnYW5pc2F0aW9uIjoxLCJpYXQiOjE2NjU4Mjg4NzAsImV4cCI6MTY2NjQzMzY3MH0.iJHy2zoAF2vO5TFxB7mOnLmVwToe10jHadPIpQQukX4" } }).then(function(response) {
    //     if (response.ok) {
    //         return response.json().then(function(jsonData) {
    //
    //             //запись полученных значений в select
    //             jsonData.forEach(function(type) {
    //                 let newOption = new Option(type["name"]);
    //                 newOption.setAttribute("id", type["id"]);
    //                 $("#transportType").append(newOption);
    //             });
    //
    //         });
    //     } else {
    //         console.log('Network request for trasportTypes.json failed with response ' + response.status + ': ' + response.statusText);
    //     }
    // });
}

function add_field(fieldType, paramId) {
    var form = document.getElementById("paramsForm");
    var new_field;
    switch (fieldType) {
        case "input":
            {
                new_field = document.createElement("input");
                new_field.setAttribute("type", "number");
                break;
            }
        case "select":
            {
                new_field = document.createElement("select");
                break;
            }
    }

    new_field.setAttribute("value", paramId);
    new_field.setAttribute("class", "form-control bg-grey text-light border-0 mt-2");
    let position = form.childElementCount;
    form.insertBefore(new_field, form.childNodes[position]);
}


function getCheckedTransportParams(transportId) {
    let url = "http://192.168.0.100:8080/api/transport/param/getParams/" + transportId;

    return fetchWithAuth(url, {}).then(function(response) {
        if (response.ok) {
            return response.json().then(function(jsonData) {
                console.log(jsonData);
                temp_transport_params = [];
                //добавление на форму выпадающих списков и инпутов для полученных параметров
                jsonData.forEach(function(param) {
                    if (param["values"].length == 0) {
                        add_field("input", param["id"]);
                    } else {
                        add_field("select", param["id"]);
                        param["values"].forEach(function(enum_value) {
                            let newOption = new Option(enum_value["name"]);
                            newOption.setAttribute("id", enum_value["id"]);
                            $(`[value=${enum_value["paramId"]}]`).append(newOption);
                        });
                    }

                });

            });
        } else {
            console.log('Network request for trasportParams.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });

    // fetch(url, { headers: { "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYUBiYi5ydSIsInJvbGUiOiJTVVBFUlZJU09SIiwib3JnYW5pc2F0aW9uIjoxLCJpYXQiOjE2NjU4Mjg4NzAsImV4cCI6MTY2NjQzMzY3MH0.iJHy2zoAF2vO5TFxB7mOnLmVwToe10jHadPIpQQukX4" } }).then(function(response) {
    //     if (response.ok) {
    //         return response.json().then(function(jsonData) {
    //             console.log(jsonData);
    //             temp_transport_params = [];
    //             //добавление на форму выпадающих списков и инпутов для полученных параметров
    //             jsonData.forEach(function(param) {
    //                 if (param["values"].length == 0) {
    //                     add_field("input", param["id"]);
    //                 } else {
    //                     add_field("select", param["id"]);
    //                     param["values"].forEach(function(enum_value) {
    //                         let newOption = new Option(enum_value["name"]);
    //                         newOption.setAttribute("id", enum_value["id"]);
    //                         $(`[value=${enum_value["paramId"]}]`).append(newOption);
    //                     });
    //                 }
    //
    //             });
    //
    //         });
    //     } else {
    //         console.log('Network request for trasportParams.json failed with response ' + response.status + ': ' + response.statusText);
    //     }
    // });


}


// 


// function updateDurationValue() {
//   let duration = $("#duration-value").val();
//   let hours = Math.trunc(duration / 60);
//   let minutes = duration - hours * 60;
//   if (hours < 10) hours = `0${hours}`;
//   if (minutes < 10) minutes = `0${minutes}`;
//   $("#duration-text").text(`${hours}:${minutes}`);

//   if ($("#time-begin").val()) {
//     let timeEnd = $("#time-begin").val() + d;
//     console.log(timeEnd);
//   }
// }

var TRANSPORT_TYPE, TRANSPORT_PARAMS = [],
    DATE, TIME_BEGIN, TIME_END, PLACE, IS_EMERGENCY = false,
    IS_SAVING_PLACE = false,
    temp_coords, temp_transport_type, temp_transport_params;


function parseTime(t) {
    var d = new Date();
    var time = t.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
    d.setMinutes(parseInt(time[2]) || 0);
    return d;
}

function updateSelectedDate() {
    let diffMilleseconds;
    let dateBegin = $("#date-begin").val();
    let timeBegin = parseTime($("#time-begin").val());
    let timeEnd = parseTime($("#time-end").val());
    if (timeBegin && timeEnd) {
        if (timeEnd > timeBegin) {
            diffMilleseconds = timeEnd - timeBegin;
            let hours = Math.trunc(diffMilleseconds / 3600000);
            let minutes = Math.trunc((diffMilleseconds - hours * 3600000) / 60000);
            if (hours < 10) hours = `0${hours}`;
            if (minutes < 10) minutes = `0${minutes}`;
            $(".modal-footer > .col-auto").removeClass("hidden");
            $("#duration-text").addClass("text-yellow");
            $("#duration-text").removeClass("text-danger");
            $("#duration-text").text(`${hours}:${minutes}`);
        } else {
            $("#duration-text").removeClass("text-yellow");
            $("#duration-text").addClass("text-danger");
            $("#duration-text").text("Начало не может быть раньше окончания!");
        }
    }
    if (dateBegin && timeBegin && timeEnd && diffMilleseconds) {
        $("#confirm-date-choose").removeClass("disabled");
    } else {
        $("#confirm-date-choose").addClass("disabled");
    }
    $("#confirm-date-choose").on("click", function() {
        DATE = dateBegin;
        TIME_BEGIN = timeBegin;
        TIME_END = timeEnd;

        $("#choose-date-button").removeClass("bg-primary");
        $("#choose-date-button").addClass("bg-success");
    });
}

function updateSelectedPlace() {
    PLACE = temp_coords;
    $("#choose-place-button").removeClass('bg-primary');
    $("#choose-place-button").addClass('bg-success');
}

    const requestTemplate = $("#request-container").html();


    ymaps.ready(init);

    function init() {
        // Создание карты.
        var placeSelectMap = new ymaps.Map("map", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [52.2503, 104.355],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 16
        });

        var mainMap = new ymaps.Map("map-main", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [52.2503, 104.355],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 15
        });

        placeSelectMap.events.add('click', function(e) {
            if (!placeSelectMap.balloon.isOpen()) {
                var coords = e.get('coords');
                temp_coords = coords;
                placeSelectMap.balloon.open(coords, {
                    contentHeader: 'Подтверждение выбора',
                    contentBody: '<p>' + [
                        coords[0].toPrecision(6),
                        coords[1].toPrecision(6)
                    ].join(', ') + '</p>',

                });

                $("#selected-coords-text").text([
                    coords[0].toPrecision(6),
                    coords[1].toPrecision(6)
                ].join(', '));
                $("#confirm-place-button").removeClass("disabled");
            } else {
                placeSelectMap.balloon.close();
            }
        });

    }



    $("#choose-transport-button").on("click", function() {
        $("#transportType").html("");
        getTransportTypes();
    });
    $("#transportType").on("change", function() {
        $("#paramsForm").html("");
        temp_transport_type = this.options[this.selectedIndex].id;
        getCheckedTransportParams(this.options[this.selectedIndex].id);
    });
    $("#confirm-transport-choose").on("click", function() {
        TRANSPORT_TYPE = temp_transport_type;
        TRANSPORT_PARAMS = [];

        $("#paramsForm > *").each(function(index, value) {
            console.log(value);
            let selectedValue = $(value).val();
            $(this).find("select").each(function() {
                if ($(this).val() == selectedValue) {
                    TRANSPORT_PARAMS.append($(this).attr("id"));
                }
            });
            // $(TRANSPORT_PARAMS).append($(value).val());
        })
    });

    $("#time-begin").on("change", updateSelectedDate);
    $("#time-end").on("change", updateSelectedDate);
    $("#confirm-place-button").on("click", updateSelectedPlace);
    $("#emergency-check").on("click", function() {
        IS_EMERGENCY = $(this).is(':checked');
    })
    $("#save-place").on("click", function() {
        IS_SAVING_PLACE = $(this).is(':checked');
    })
    $("option").on("click", function() {
        console.log($(this).parent());
        $(this).parent().attr("value", $(this).attr("id"));
    })

    $("#confirm-request").on("click", function() {
        console.log(
            `TRANSPORT_TYPE: ${TRANSPORT_TYPE}\nDATE: ${DATE}\nTIME_BEGIN: ${TIME_BEGIN}\nTIME_END: ${TIME_END}\nPLACE: ${PLACE}\nIS_EMERGENCY: ${IS_EMERGENCY}\nIS_SAVING_PLACE: ${IS_SAVING_PLACE}\n
        `
        )
        console.log(TRANSPORT_PARAMS);
        if (DATE && TIME_BEGIN && TIME_END && PLACE) {

        }
        $("#request-container").html($("#request-container").html() + requestTemplate);
        $(".request").each(function(index, element) {
            $(this).find($(".request-id")).text(`#${index}`)
        });
    });

});