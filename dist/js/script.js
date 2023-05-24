//------konstante------------------------------------------------
var url = "https://dev.vub.zone/sandbox/router.php";
var projekt = "p_dmaretic";
var perPage = 10;
var tip = 0;
var errorAtomic = '<br />';
var errorAtomic2 = '<b>Warning</b>:  Invalid argument supplied for foreach() in <b>/home/sites/site01/www/docroot/sandbox/router.php</b> on line <b>672</b><br />';
var user;
var userID;



//-----------ajaxSetup-------------------------------------------------------
$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    }
});

//kontrole za unos podataka
//------------------------LOGIN--------------------------------
$(document).on('click', '#getLogin', function () {
    var email = $('#inputEmail').val();
    var password = $('#inputPassword').val();
    if (email == null || email == "") {
        Swal.fire('Molimo unesite email adresu');
    } else if (password == null || password == "") {
        Swal.fire('Molimo unesite zaporku');
    } else {
        login();
    }
    return false;
})



function login() {
    if (document.getElementById("inputType").checked) tip = 1;
    else tip = 0;
    user = document.getElementById("inputEmail").value;
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_login",
            "EMAIL": $('#inputEmail').val(),
            "ZAPORKA": $('#inputPassword').val(),
            "TIP": tip
        },
        success: function (data) {
            data = data.replace(errorAtomic, '');
            data = data.replace(errorAtomic2, '');
            console.log(data)
            var jsonBody = JSON.parse(data);
            var errcod = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            userID = jsonBody.data[0].ID;

            if (message == null || message == "", errcod == null || errcod == 0) {
                if (tip == 0)
                    $(function () {
                        $("#main-wrapper").load("mainA.html", function () { document.getElementById('name').innerHTML = user; });
                    });
                if (tip == 1)
                    $(function () {
                        $("#main-wrapper").load("main.html", function () { document.getElementById('name').innerHTML = user; });
                    });
            } else {
                Swal.fire(message + '.' + errcod);
            }
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true
    });
    return false;
}

function logout() {
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": "p_common",
            "procedura": "p_logout"
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "" || errcode == null) {
                Swal.fire("Greška u obradi podataka, molimo pokušajte ponovno!");
            } else {
                Swal.fire(message + '.' + errcode);

            }
            window.location.href = "index.html";
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true
    });
}

function studentiA() {
    $(function () {
        $("#content").load("studentiA.html");
    });
}

function profesoriA() {
    $(function () {
        $("#content").load("profesoriA.html");
    });
}

function predmetiA() {
    $(function () {
        $("#content").load("predmetiA.html");
    });
}

function prijedloziA() {
    $(function () {
        $("#content").load("prijedloziA.html");
    });
}

function radoviA() {
    $(function () {
        $("#content").load("radoviA.html");
    });
}

function studenti() {
    $(function () {
        $("#content").load("studenti.html");
    });
}

function profesori() {
    $(function () {
        $("#content").load("profesori.html");
    });
}

function predmeti() {
    $(function () {
        $("#content").load("predmeti.html");
    });
}

function prijedlozi() {
    $(function () {
        $("#content").load("prijedlozi.html");
    });
}

function radovi() {
    $(function () {
        $("#content").load("radovi.html");
    });
}

//----------------------------------------------------------------
function pagination(func, pageNmb, perPage, count) {
    //ne treba prikazivati ništa
    if (count < perPage) {
        return '';
    } else {
        var quotient = Math.ceil(count / perPage);
    }
    var next = pageNmb + 1;
    var prev = pageNmb - 1;
    var pagination = '<div class="float-right pagination">';

    //treba prikazati previous
    if (pageNmb > 0) {
        pagination += '<ul class="pagination"><li class="page-item "><a class="page-link" onclick="' + func + '(' + prev + ')" href="javascript:void(0)">‹</a></li>';
    }

    for (i = pageNmb; i < pageNmb + 8; i++) {
        pagination += '<li class="page-item"><a class="page-link" onclick="' + func + ' (' + i + ')" href="javascript:void(0)">' + (i + 1) + '</a></li>';
    }

    pagination += '<li class="page-item"><a class="page-link"  href="javascript:void(0)">...</a></li>';

    pagination += '<li class="page-item"><a class="page-link" onclick="' + func + '(' + quotient + ')" href="javascript:void(0)">' + quotient + '</a></li>';

    pagination += '<li class="page-item"><a class="page-link" onclick="' + func + '(' + next + ')" href="javascript:void(0)">›</a></li>';
    pagination += '</ul></div>';
    return pagination;
}

function insertFormStudent(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">ime</th><td><input type="text" id="IME"></td></tr>';
    output += '<tr><th scope="col">prezime</th><td><input type="text" id="PREZIME"></td></tr>';
    output += '<tr><th scope="col">email</th><td><input type="email" id="EMAIL"></td></tr>';
    output += '<tr><th scope="col">Zaporka</th><td><input type="text" id="PASSWORD"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiStu">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showStudenti(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#content").html(output);
}


function showStudenti(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var func = "showStudenti";
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormStudent(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">ime</th><th scope="col">prezime</th>';
    tablica += '<th scope="col">email</th></tr></thead>'

    $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_studenti",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    tablica += '<tr><td>' + v.IME + '</td>';
                    tablica += '<td>' + v.PREZIME + '</td>';
                    tablica += '<td>' + v.EMAIL + '</td>';
                    tablica += '<td><button type="button" class="btn btn-primary" onclick="showStudent(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                    tablica += '<button type="button" class="btn btn-danger" onclick="delStudent(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
                });
                tablica += '</tbody></table>';
                tablica += pagination(func, page, perPage, count);
                console.log(tablica);
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
            console.log(data)
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


function showStudent(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_studenti", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input type="text" id="ID" value="' + v.ID + '" readonly></td></tr>';
                    tablica += '<tr><th scope="col">ime</th><td><input type="text" id="IME" value="' + v.IME + '"></td></tr>';
                    tablica += '<tr><th scope="col">prezime</th><td><input type="text" id="PREZIME" value="' + v.PREZIME + '"></td></tr>';
                    tablica += '<tr><th scope="col">email</th><td><input type="text" id="EMAIL" value="' + v.EMAIL + '"></td></tr>';
                    tablica += '<tr><th scope="col">zaporka</th><td><input type="text" id="PASSWORD" value="' + v.ZAPORKA + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiStu">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showStudenti(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
                });
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


$(document).on('click', '#spremiStu', function () {
    var IME = $('#IME').val();
    var PREZIME = $('#PREZIME').val();
    var EMAIL = $('#EMAIL').val();
    var ZAPORKA = $('#PASSWORD').val();
    var ID = $('#ID').val();

    if (IME == null || IME == "") {
        Swal.fire('Molimo unesite ime studenta');
    } else if (PREZIME == null || PREZIME == "") {
        Swal.fire('Molimo unesite prezime studenta');
    } else if (EMAIL == null || EMAIL == "") {
        Swal.fire('Molimo unesite email studenta');
    } else if ((ZAPORKA == null || ZAPORKA == "")) {
        Swal.fire('Molimo unesite zaporku studenta');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_change_student",
                "ID": ID,
                "IME": IME,
                "PREZIME": PREZIME,
                "EMAIL": EMAIL,
                "ZAPORKA": ZAPORKA
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspjesno se unijeli studenta');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                showStudenti();
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: true
        });
    }
})


function delStudent(ID, page) {
    Swal.fire({
        title: 'Želite li zaista obrisati studenta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši studenta!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_change_student",
                    "ID": ID,
                    "ACTION": "delete"
                },
                success: function (data) {
                    var jsonBody = JSON.parse(data);
                    var errcode = jsonBody.h_errcode;
                    var message = jsonBody.h_message;
                    console.log(data);

                    if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                        Swal.fire(
                            'Uspješno ',
                            'ste obrisali studenta',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    showStudenti();
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                },
                async: true
            });
        }
    })
}


















function insertFormProfesor(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">ime</th><td><input type="text" id="IME"></td></tr>';
    output += '<tr><th scope="col">prezime</th><td><input type="text" id="PREZIME"></td></tr>';
    output += '<tr><th scope="col">email</th><td><input type="email" id="EMAIL"></td></tr>';
    output += '<tr><th scope="col">Zaporka</th><td><input type="text" id="PASSWORD"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiPro">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showProfesori(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#content").html(output);
}


function showProfesori(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var func = "showProfesori";
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormProfesor(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">ime</th><th scope="col">prezime</th>';
    tablica += '<th scope="col">email</th></tr></thead>'

    $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_profesori",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    tablica += '<tr><td>' + v.IME + '</td>';
                    tablica += '<td>' + v.PREZIME + '</td>';
                    tablica += '<td>' + v.EMAIL + '</td>';
                    tablica += '<td><button type="button" class="btn btn-primary" onclick="showProfesor(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                    if (v.ID != userID)
                        tablica += '<button type="button" class="btn btn-danger" onclick="delProfesor(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
                });
                tablica += '</tbody></table>';
                tablica += pagination(func, page, perPage, count);
                console.log(tablica);
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


function showProfesor(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_profesori", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input type="text" id="ID" value="' + v.ID + '" readonly></td></tr>';
                    tablica += '<tr><th scope="col">ime</th><td><input type="text" id="IME" value="' + v.IME + '"></td></tr>';
                    tablica += '<tr><th scope="col">prezime</th><td><input type="text" id="PREZIME" value="' + v.PREZIME + '"></td></tr>';
                    tablica += '<tr><th scope="col">email</th><td><input type="text" id="EMAIL" value="' + v.EMAIL + '"></td></tr>';
                    tablica += '<tr><th scope="col">zaporka</th><td><input type="text" id="PASSWORD" value="' + v.ZAPORKA + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiPro">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showProfesori(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
                });
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


$(document).on('click', '#spremiPro', function () {
    var IME = $('#IME').val();
    var PREZIME = $('#PREZIME').val();
    var EMAIL = $('#EMAIL').val();
    var ZAPORKA = $('#PASSWORD').val();
    var ID = $('#ID').val();

    if (IME == null || IME == "") {
        Swal.fire('Molimo unesite ime profesora');
    } else if (PREZIME == null || PREZIME == "") {
        Swal.fire('Molimo unesite prezime profesora');
    } else if (EMAIL == null || EMAIL == "") {
        Swal.fire('Molimo unesite email profesora');
    } else if ((ZAPORKA == null || ZAPORKA == "")) {
        Swal.fire('Molimo unesite zaporku profesora');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_change_profesor",
                "ID": ID,
                "IME": IME,
                "PREZIME": PREZIME,
                "EMAIL": EMAIL,
                "ZAPORKA": ZAPORKA
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspjesno se unijeli profesora');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                showProfesori();
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: true
        });
    }
})


function delProfesor(ID, page) {
    Swal.fire({
        title: 'Želite li zaista obrisati profesora?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši profesora!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_change_profesor",
                    "ID": ID,
                    "ACTION": "delete"
                },
                success: function (data) {
                    var jsonBody = JSON.parse(data);
                    var errcode = jsonBody.h_errcode;
                    var message = jsonBody.h_message;
                    console.log(data);

                    if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                        Swal.fire(
                            'Uspješno ',
                            'ste obrisali profesora',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    showProfesori();
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                },
                async: true
            });
        }
    })
}
























function insertFormPredmet(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">naziv</th><td><input type="text" id="NAZIV"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiPre">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showPredmeti(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#content").html(output);
}


function showPredmeti(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var func = "showPredmeti";
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormPredmet(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">naziv</th></tr></thead>';

    $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_predmeti",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    tablica += '<tr><td>' + v.NAZIV + '</td>';
                    tablica += '<td><button type="button" class="btn btn-primary" onclick="showPredmet(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                    tablica += '<button type="button" class="btn btn-danger" onclick="delPredmet(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
                });
                tablica += '</tbody></table>';
                tablica += pagination(func, page, perPage, count);
                console.log(tablica);
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


function showPredmet(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_predmeti", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input type="text" id="ID" value="' + v.ID + '" readonly></td></tr>';
                    tablica += '<tr><th scope="col">ime</th><td><input type="text" id="NAZIV" value="' + v.NAZIV + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiPre">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showPredmeti(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
                });
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


$(document).on('click', '#spremiPre', function () {
    var NAZIV = $('#NAZIV').val();
    var ID = $('#ID').val();

    if (NAZIV == null || NAZIV == "") {
        Swal.fire('Molimo unesite ime predmeta');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_change_predmet",
                "ID": ID,
                "NAZIV": NAZIV
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspjesno se unijeli predmet');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                showPredmeti();
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: true
        });
    }
})


function delPredmet(ID, page) {
    Swal.fire({
        title: 'Želite li zaista obrisati predmet?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši predmet!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_change_predmet",
                    "ID": ID,
                    "ACTION": "delete"
                },
                success: function (data) {
                    var jsonBody = JSON.parse(data);
                    var errcode = jsonBody.h_errcode;
                    var message = jsonBody.h_message;
                    console.log(data);

                    if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                        Swal.fire(
                            'Uspješno ',
                            'ste obrisali predmet',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    showPredmeti();
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                }
            });
        }
    })
}






























function insertFormPrijedlog(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">naziv</th><td><input type="text" id="NAZIV"></td></tr>';
    output += '<tr><th scope="col">idstudent</th><td><input type="number" id="IDSTUDENT"></td></tr>';
    output += '<tr><th scope="col">Custom</th><td><input type="checkbox" id="FLAGCUSTOM"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiPri">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showPrijedlozi(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#content").html(output);
}


function showPrijedlozi(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var studentmap = {};
    var func = "showPrijedlozi";
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormPrijedlog(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">Naziv</th><th scope="col">Student</th>';
    tablica += '<th scope="col">Custom</th></tr></thead>'

    $.when(ajax1()).done(function (a1) {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_prijedlozi",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    jsonBody.data.forEach(v => {
                        tablica += '<tr><td>' + v.NAZIV + '</td>';
                        tablica += '<td>' + studentmap[v.IDSTUDENT] + '</td>';
                        tablica += '<td>' + v.FLAGCUSTOM + '</td>';
                        tablica += '<td><button type="button" class="btn btn-primary" onclick="showPrijedlog(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                        tablica += '<button type="button" class="btn btn-danger" onclick="delPrijedlog(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
                    });
                    tablica += '</tbody></table>';
                    tablica += pagination(func, page, perPage, count);
                    console.log(tablica);
                    document.getElementById("content").innerHTML = tablica;
                } else {
                    if (errcode == 999) {
                        window.location.href = "index.html";
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                };
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }
        });
    });

    function ajax1() {
        return $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_studenti",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    jsonBody.data.forEach(v => {
                        studentmap[v.ID] = v.IME + ' ' + v.PREZIME;
                    });
                } else {
                    if (errcode == 999) {
                        window.location.href = "index.html";
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                };
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }
        });
    }
}


function showPrijedlog(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_prijedlozi", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input type="text" id="ID" value="' + v.ID + '" readonly></td></tr>';
                    tablica += '<tr><th scope="col">naziv</th><td><input type="text" id="NAZIV" value="' + v.NAZIV + '"></td></tr>';
                    tablica += '<tr><th scope="col">ID studenta</th><td><input type="text" id="IDSTUDENT" value="' + v.IDSTUDENT + '"></td></tr>';
                    tablica += '<tr><th scope="col">Custom</th><td><input type="checkbox" id="FLAGCUSTOM"';
                    if (v.FLAGCUSTOM == 1) tablica += 'checked';
                    tablica += '></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiPri">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showPrijedlozi(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
                });
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


$(document).on('click', '#spremiPri', function () {
    var NAZIV = $('#NAZIV').val();
    var IDSTUDENT = $('#IDSTUDENT').val();
    var FLAGCUSTOM;
    var ID = $('#ID').val();

    if (document.getElementById('FLAGCUSTOM').checked) FLAGCUSTOM = 1;
    else FLAGCUSTOM = 0;

    console.log(FLAGCUSTOM)

    if (NAZIV == null || NAZIV == "") {
        Swal.fire('Molimo unesite naziv prijedloga');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_change_prijedlog",
                "ID": ID,
                "NAZIV": NAZIV,
                "IDSTUDENT": IDSTUDENT,
                "FLAGCUSTOM": FLAGCUSTOM
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspjesno se unijeli prijedlog');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                showPrijedlozi();
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: true
        });
    }
})


function delPrijedlog(ID, page) {
    Swal.fire({
        title: 'Želite li zaista obrisati prijedlog?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši prijedlog!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_change_prijedlog",
                    "ID": ID,
                    "ACTION": "delete"
                },
                success: function (data) {
                    var jsonBody = JSON.parse(data);
                    var errcode = jsonBody.h_errcode;
                    var message = jsonBody.h_message;
                    console.log(data);

                    if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                        Swal.fire(
                            'Uspješno ',
                            'ste obrisali prijedlog',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    showPrijedlozi();
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                },
                async: true
            });
        }
    })
}


































function insertFormRad(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">IDprijedlog</th><td><input type="number" id="IDPRIJEDLOG"></td></tr>';
    output += '<tr><th scope="col">IDprofesor</th><td><input type="number" id="IDPROFESOR"></td></tr>';
    output += '<tr><th scope="col">IDpredmet</th><td><input type="number" id="IDPREDMETI"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiRad">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showRadovi(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#content").html(output);
}


function showRadovi(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var profesornum = [];
    var predmetnum = [];
    var studentmap = [];
    var profesormap = [];
    var predmetmap = [];
    var prijedlogNamemap = [];
    var prijedlogStudentmap = [];
    var func = "showRadovi";
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormRad(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col">Naziv </th><th scope="col">Student</th>';
    tablica += '<th scope="col">Profesor</th><th scope="col">Predmet</th></tr></thead>'


    $.when(ajax1(), ajax2(), ajax3(), ajax4()).done(function (a1, a2, a3, a4) {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_radovi",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    jsonBody.data.forEach(v => {
                        tablica += '<tr><td>' + prijedlogNamemap[v.IDPRIJEDLOG] + '</td>';
                        tablica += '<td>' + studentmap[prijedlogStudentmap[v.IDPRIJEDLOG]] + '</td>';
                        if (profesornum[v.IDPROFESOR] == null) profesornum[v.IDPROFESOR] = 0;
                        profesornum[v.IDPROFESOR] = profesornum[v.IDPROFESOR] + 1;
                        tablica += '<td>' + profesormap[v.IDPROFESOR] + '</td>';
                        if (predmetnum[v.IDPREDMETI] == null) predmetnum[v.IDPREDMETI] = 0;
                        predmetnum[v.IDPREDMETI] = predmetnum[v.IDPREDMETI] + 1;
                        tablica += '<td>' + predmetmap[v.IDPREDMETI] + '</td>';
                        tablica += '<td><button type="button" class="btn btn-primary" onclick="showRad(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                        tablica += '<button type="button" class="btn btn-danger" onclick="delRad(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
                    });
                    tablica += '</tbody></table>';
                    tablica += pagination(func, page, perPage, count);
                    console.log(tablica);


                    var charts = '<div id="chartContainer1" style="height: 370px; width: 50%; display:inline-block;"></div><div id="chartContainer2" style="height: 370px; width: 50%; display:inline-block;"></div>';
                    
                    document.getElementById("content").innerHTML = charts;
                    document.getElementById("content").innerHTML += tablica;


                    console.log(profesornum)
                    var datapointProf = [];
                    $.each(profesornum, function (k, v) {
                        if (profesornum[k] != null) datapointProf.push({y:profesornum[k],label:profesormap[k]});
                    });
                    var datapointPred = [];
                    $.each(predmetnum, function (k, v) {
                        if (predmetnum[k] != null) datapointPred.push({y:predmetnum[k],label:predmetmap[k]});
                    });
                    console.log(datapointProf)
                    var chart1 = new CanvasJS.Chart("chartContainer1", {
                        animationEnabled: true,
                        title: {
                            text: "Kružni graf profesora prema broju mentorstva"
                        },
                        data: [{
                            type: "pie",
                            startAngle: 240,
                            yValueFormatString: "##0",
                            indexLabel: "{label} {y}",
                            dataPoints: datapointProf
                        }]
                    });
                    chart1.render();


                    var chart2 = new CanvasJS.Chart("chartContainer2", {
                        animationEnabled: true,
                        title: {
                            text: "Kružni graf predmeta prema prisutnosti u radovima"
                        },
                        data: [{
                            type: "pie",
                            startAngle: 240,
                            yValueFormatString: "##0",
                            indexLabel: "{label} {y}",
                            dataPoints: datapointPred
                        }]
                    });
                    chart2.render();
                }
             else {
                if(errcode == 999) {
            window.location.href = "index.html";
        } else {
            Swal.fire(message + '.' + errcode);
        }
    };
},
error: function (xhr, textStatus, error) {
    console.log(xhr.statusText);
    console.log(textStatus);
    console.log(error);
},

        });
    });
function ajax1() {
    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_studenti",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    studentmap[v.ID] = v.IME + ' ' + v.PREZIME;
                });
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        }
    });
}
function ajax2() {
    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_profesori",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    profesormap[v.ID] = v.IME + ' ' + v.PREZIME;
                });
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        }
    });
}
function ajax3() {
    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_predmeti",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    predmetmap[v.ID] = v.NAZIV;
                });
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        }
    });
}
function ajax4() {
    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_prijedlozi",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    prijedlogNamemap[v.ID] = v.NAZIV;
                    prijedlogStudentmap[v.ID] = v.IDSTUDENT;
                });
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        }
    });
}
}


function showRad(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_radovi", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input type="text" id="ID" value="' + v.ID + '" readonly></td></tr>';
                    tablica += '<tr><th scope="col">ID prijedloga</th><td><input type="number" id="IDPRIJEDLOG" value="' + v.IDPRIJEDLOG + '"></td></tr>';
                    tablica += '<tr><th scope="col">ID profesora</th><td><input type="number" id="IDPROFESOR" value="' + v.IDPROFESOR + '"></td></tr>';
                    tablica += '<tr><th scope="col">ID predmeta</th><td><input type="number" id="IDPREDMETI" value="' + v.IDPREDMETI + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiRad">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showRadovi(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
                });
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


$(document).on('click', '#spremiRad', function () {
    var IDPRIJEDLOG = $('#IDPRIJEDLOG').val();
    var IDPREDMETI = $('#IDPREDMETI').val();
    var IDPROFESOR = $('#IDPROFESOR').val();
    var ID = $('#ID').val();

    if (IDPRIJEDLOG == null || IDPRIJEDLOG == "") {
        Swal.fire('Molimo unesite ID prijedloga');
    }
    else if (IDPREDMETI == null || IDPREDMETI == "") {
        Swal.fire('Molimo unesite ID predmeta');
    }
    else if (IDPROFESOR == null || IDPROFESOR == "") {
        Swal.fire('Molimo unesite ID profesora');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_change_rad",
                "ID": ID,
                "IDPRIJEDLOG": IDPRIJEDLOG,
                "IDPREDMETI": IDPREDMETI,
                "IDPROFESOR": IDPROFESOR
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspjesno ste unijeli rad');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                showRadovi();
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: true
        });
    }
})


function delRad(ID, page) {
    Swal.fire({
        title: 'Želite li zaista obrisati rad?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši rad!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_change_rad",
                    "ID": ID,
                    "ACTION": "delete"
                },
                success: function (data) {
                    var jsonBody = JSON.parse(data);
                    var errcode = jsonBody.h_errcode;
                    var message = jsonBody.h_message;
                    console.log(data);

                    if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                        Swal.fire(
                            'Uspješno ',
                            'ste obrisali rad',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    showRadovi();
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                },
                async: true
            });
        }
    })
}













































































function showStudentiS(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var func = "showStudentiS";
    var tablica = '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col"><b><font size=20>ime</th><th scope="col"><b><font size=20>prezime</th>';
    tablica += '<th scope="col"><b><font size=20>email</b></th></tr></thead>'

    $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_studenti",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    tablica += '<tr><td>' + v.IME + '</td>';
                    tablica += '<td>' + v.PREZIME + '</td>';
                    tablica += '<td>' + v.EMAIL + '</td>';
                });
                tablica += '</tbody></table>';
                tablica += pagination(func, page, perPage, count);
                console.log(tablica);
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
            console.log(data)
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}





















function showProfesoriS(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var func = "showProfesoriS";
    var tablica = '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col"><b><font size=20>ime</th><th scope="col"><b><font size=20>prezime</th>';
    tablica += '<th scope="col"><b><font size=20>email</th></tr></thead>'

    $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_profesori",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    tablica += '<tr><td>' + v.IME + '</td>';
                    tablica += '<td>' + v.PREZIME + '</td>';
                    tablica += '<td>' + v.EMAIL + '</td>';
                });
                tablica += '</tbody></table>';
                tablica += pagination(func, page, perPage, count);
                console.log(tablica);
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


























function showPredmetiS(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var func = "showPredmetiS";
    var tablica = '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col"><b><font size=20>naziv</th></tr></thead>';

    $.ajax({
        type: 'POST',
        url: url,
        data: {
            "projekt": projekt,
            "procedura": "p_get_predmeti",
            "perpage": perPage,
            "page": page
        },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                jsonBody.data.forEach(v => {
                    tablica += '<tr><td>' + v.NAZIV + '</td>';
                });
                tablica += '</tbody></table>';
                tablica += pagination(func, page, perPage, count);
                console.log(tablica);
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}





























function insertFormPrijedlogS(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">naziv</th><td><input type="text" id="NAZIV"></td></tr>';
    output += '<tr><th scope="col">idstudent</th><td><input type="number" id="IDSTUDENT" value="' + userID + '" readonly></td></tr>';
    output += '<tr><th scope="col">Custom</th><td><input type="checkbox" id="FLAGCUSTOM" checked disabled></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiPriS">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showPrijedloziS(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#content").html(output);
}



function showPrijedloziS(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var studentmap = [];
    var func = "showPrijedloziS";

    $.when(ajax1()).done(function (a1) {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_prijedlozi",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;
                var nezauzet = 1;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    var tablica = '<br>'
                    jsonBody.data.forEach(v => {
                        if (v.IDSTUDENT == userID) nezauzet = 0;
                    });
                    if (nezauzet == 1) {
                        tablica += '<button type="button" style="float:right;" class="btn btn-success" onclick="insertFormPrijedlogS(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
                    }
                    tablica += '<table class="table table-hover"><tbody><thead><tr>';
                    tablica += '<th scope="col"><b><font size=20>Naziv</th><th scope="col"><b><font size=20>Student</th>';
                    tablica += '<th scope="col"><b><font size=20>Custom</th></tr></thead>'
                    jsonBody.data.forEach(v => {
                        tablica += '<tr><td>' + v.NAZIV + '</td>';
                        tablica += '<td>' + studentmap[v.IDSTUDENT] + '</td>';
                        tablica += '<td>' + v.FLAGCUSTOM + '</td>';
                        if ((v.IDSTUDENT == userID) && (v.FLAGCUSTOM == 1)) {
                            tablica += '<td><button type="button" class="btn btn-primary" onclick="showPrijedlogS(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                            tablica += '<button type="button" class="btn btn-danger" onclick="delPrijedlogS(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
                        }
                        if ((v.IDSTUDENT == null) && (v.FLAGCUSTOM == 0) && (nezauzet == 1)) {
                            tablica += '<td><button type="button" class="btn btn-primary" onclick="showPrijedlogS(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                        }
                    });
                    tablica += '</tbody></table>';
                    tablica += pagination(func, page, perPage, count);
                    console.log(tablica);
                    document.getElementById("content").innerHTML = tablica;
                } else {
                    if (errcode == 999) {
                        window.location.href = "index.html";
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                };
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }

        });
    });

    function ajax1() {
        return $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_studenti",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    jsonBody.data.forEach(v => {
                        studentmap[v.ID] = v.IME + ' ' + v.PREZIME;
                    });
                } else {
                    if (errcode == 999) {
                        window.location.href = "index.html";
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                };
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }
        });
    }


}


function showPrijedlogS(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_prijedlozi", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input type="text" id="ID" value="' + v.ID + '" readonly></td></tr>';
                    tablica += '<tr><th scope="col">naziv</th><td><input type="text" id="NAZIV" value="' + v.NAZIV + '" ';
                    if (v.FLAGCUSTOM == 0) tablica += 'readonly';
                    tablica += '></td></tr>';
                    tablica += '<tr><th scope="col">Student</th><td><input type="text" id="IDSTUDENT" value="' + userID + '" readonly></td></tr>';
                    tablica += '<tr><th scope="col">Custom</th><td><input type="checkbox" id="FLAGCUSTOM"';
                    if (v.FLAGCUSTOM == 1) tablica += ' checked';
                    tablica += ' disabled></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiPriS">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showPrijedloziS(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
                });
                document.getElementById("content").innerHTML = tablica;
            } else {
                if (errcode == 999) {
                    window.location.href = "index.html";
                } else {
                    Swal.fire(message + '.' + errcode);
                }
            };
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}


$(document).on('click', '#spremiPriS', function () {
    var NAZIV = $('#NAZIV').val();
    var IDSTUDENT = $('#IDSTUDENT').val();
    var FLAGCUSTOM;
    var ID = $('#ID').val();

    if (document.getElementById('FLAGCUSTOM').checked) FLAGCUSTOM = 1;
    else FLAGCUSTOM = 0;

    console.log(FLAGCUSTOM)

    if (NAZIV == null || NAZIV == "") {
        Swal.fire('Molimo unesite naziv prijedloga');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_change_prijedlog",
                "ID": ID,
                "NAZIV": NAZIV,
                "IDSTUDENT": IDSTUDENT,
                "FLAGCUSTOM": FLAGCUSTOM
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspjesno se unijeli prijedlog');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                showPrijedloziS();
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: true
        });
    }
})


function delPrijedlogS(ID, page) {
    Swal.fire({
        title: 'Želite li zaista obrisati prijedlog?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši prijedlog!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_change_prijedlog",
                    "ID": ID,
                    "ACTION": "delete"
                },
                success: function (data) {
                    var jsonBody = JSON.parse(data);
                    var errcode = jsonBody.h_errcode;
                    var message = jsonBody.h_message;
                    console.log(data);

                    if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                        Swal.fire(
                            'Uspješno ',
                            'ste obrisali prijedlog',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    showPrijedloziS();
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                },
                async: true
            });
        }
    })
}


































function showRadoviS(page) {

    if (page == null || page == "") {
        page = 0;
    }

    var profesornum = [];
    var predmetnum = [];
    var studentmap = [];
    var profesormap = [];
    var predmetmap = [];
    var prijedlogNamemap = [];
    var prijedlogStudentmap = [];
    var func = "showRadovi";
    tablica = '<table class="table table-hover"><tbody><thead><tr>';
    tablica += '<th scope="col"><b><font size=20>Naziv </th><th scope="col"><b><font size=20>Student</th>';
    tablica += '<th scope="col"><b><font size=20>Profesor</th><th scope="col"><b><font size=20>Predmet</th></tr></thead>'

    $.when(ajax1(), ajax2(), ajax3(), ajax4()).done(function (a1, a2, a3, a4) {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_radovi",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    jsonBody.data.forEach(v => {
                        tablica += '<tr><td>' + prijedlogNamemap[v.IDPRIJEDLOG] + '</td>';
                        tablica += '<td>' + studentmap[prijedlogStudentmap[v.IDPRIJEDLOG]] + '</td>';
                        if (profesornum[v.IDPROFESOR] == null) profesornum[v.IDPROFESOR] = 0;
                        profesornum[v.IDPROFESOR] = profesornum[v.IDPROFESOR] + 1;
                        tablica += '<td>' + profesormap[v.IDPROFESOR] + '</td>';
                        if (predmetnum[v.IDPREDMETI] == null) predmetnum[v.IDPREDMETI] = 0;
                        predmetnum[v.IDPREDMETI] = predmetnum[v.IDPREDMETI] + 1;
                        tablica += '<td>' + predmetmap[v.IDPREDMETI] + '</td>';
                    });
                    tablica += '</tbody></table>';
                    tablica += pagination(func, page, perPage, count);
                    console.log(tablica);


                    var charts = '<div id="chartContainer1" style="height: 370px; width: 50%; display:inline-block;"></div><div id="chartContainer2" style="height: 370px; width: 50%; display:inline-block;"></div>';
                    
                    document.getElementById("content").innerHTML = charts;
                    document.getElementById("content").innerHTML += tablica;


                    console.log(profesornum)
                    var datapointProf = [];
                    $.each(profesornum, function (k, v) {
                        if (profesornum[k] != null) datapointProf.push({y:profesornum[k],label:profesormap[k]});
                    });
                    var datapointPred = [];
                    $.each(predmetnum, function (k, v) {
                        if (predmetnum[k] != null) datapointPred.push({y:predmetnum[k],label:predmetmap[k]});
                    });
                    console.log(datapointProf)
                    var chart1 = new CanvasJS.Chart("chartContainer1", {
                        animationEnabled: true,
                        title: {
                            text: "Kružni graf profesora prema broju mentorstva"
                        },
                        data: [{
                            type: "pie",
                            startAngle: 240,
                            yValueFormatString: "##0",
                            indexLabel: "{label} {y}",
                            dataPoints: datapointProf
                        }]
                    });
                    chart1.render();


                    var chart2 = new CanvasJS.Chart("chartContainer2", {
                        animationEnabled: true,
                        title: {
                            text: "Kružni graf predmeta prema prisutnosti u radovima"
                        },
                        data: [{
                            type: "pie",
                            startAngle: 240,
                            yValueFormatString: "##0",
                            indexLabel: "{label} {y}",
                            dataPoints: datapointPred
                        }]
                    });
                    chart2.render();
                }
             else {
                if(errcode == 999) {
            window.location.href = "index.html";
        } else {
            Swal.fire(message + '.' + errcode);
        }
    };
},
error: function (xhr, textStatus, error) {
    console.log(xhr.statusText);
    console.log(textStatus);
    console.log(error);
},

        });
    });
    function ajax1() {
        return $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_studenti",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    jsonBody.data.forEach(v => {
                        studentmap[v.ID] = v.IME + ' ' + v.PREZIME;
                    });
                } else {
                    if (errcode == 999) {
                        window.location.href = "index.html";
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                };
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }
        });
    }
    function ajax2() {
        return $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_profesori",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    jsonBody.data.forEach(v => {
                        profesormap[v.ID] = v.IME + ' ' + v.PREZIME;
                    });
                } else {
                    if (errcode == 999) {
                        window.location.href = "index.html";
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                };
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }
        });
    }
    function ajax3() {
        return $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_predmeti",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    jsonBody.data.forEach(v => {
                        predmetmap[v.ID] = v.NAZIV;
                    });
                } else {
                    if (errcode == 999) {
                        window.location.href = "index.html";
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                };
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }
        });
    }
    function ajax4() {
        return $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_get_prijedlozi",
                "perpage": perPage,
                "page": page
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                var count = jsonBody.count;


                if (message == null || message == "", errcode == null || errcode == 0) {
                    jsonBody.data.forEach(v => {
                        prijedlogNamemap[v.ID] = v.NAZIV;
                        prijedlogStudentmap[v.ID] = v.IDSTUDENT;
                    });
                } else {
                    if (errcode == 999) {
                        window.location.href = "index.html";
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                };
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            }
        });
    }

}
