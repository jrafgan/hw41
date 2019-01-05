$(function () {
    $.getJSON('https://restcountries.eu/rest/v2/all?fields=name;flag', function(countries) {
        var options = {
            data: countries,
            getValue: "name",
            theme: "square",
            list: {match: {enabled: true}},
            template: {
                type: "iconRight",
                fields: {
                    iconSrc: "flag"
                }
            }
        };
        $("#country").easyAutocomplete(options);
    });
    $( "#date" ).datepicker();

    var parent = $('#posts');
    var dbName = "posts";

    if (localStorage.getItem('id') === null) {
        localStorage.setItem('id', '1');
    }

    var storageData = getPostsFromStorage();
    for (var i = 0; i < storageData.length; i++) {
        createPost(storageData[i]);
    }

    function getPostsFromStorage() {
        var value;
        if (localStorage.getItem(dbName) === null) {
            localStorage.setItem(dbName, '[]');
            value = [];
        } else {
            value = localStorage.getItem(dbName);
            value = JSON.parse(value);
        }
        return value;
    }

    function addPostToStorage(postData) {
        var value = getPostsFromStorage();
        value.push(postData);
        value = JSON.stringify(value);
        localStorage.setItem(dbName, value);
    }

    function savePostsToStorage(postsArray) {
        var value = postsArray;
        value = JSON.stringify(value);
        localStorage.setItem(dbName, value);
    }

    function createPost(data) {
        var post = $('<div class="post">');
        var header = $('<div class="buttons"><a href="#" id="btn-edit">Edit</a><a href="#" id="btn-remove">Remove</a></div><p class="header">Post #<span class="number">'+ data.id +'</span> at <span class="date">' + data.date + '</span> being in <span class="country">'+ data.country +'</span></p>');
        var body = $('<p class="text">' + data.text + '</p>');
        post.append(header);
        post.append(body);
        parent.append(post);
    }

    $(document).on('click', '#btn-addPost', function (e) {
        e.preventDefault();

        var id = parseInt(localStorage.getItem('id'));
        var postData = {};
        postData.country = $('#country').val();
        postData.date = $('#date').val();
        postData.text = $('#text').val();
        postData.id = id;
        id++;

        if (postData.text !== '' && postData.date !== '' && postData.country !== '') {
            localStorage.setItem('id', id);
            addPostToStorage(postData);
            createPost(postData);
            $('#postForm').trigger("reset");
            $.iaoAlert({msg: "Вы успешно добавили пост.", type: "success", mode: "dark"});
        } else {
            $.iaoAlert({msg: "Необходимо заполнить все поля чтобы добавить запись !", type: "warning", mode: "dark"});
        }
    });

    function findIndex() {

    }

    $(document).on('click', '#btn-remove', function (e) {
        if (confirm('Вы действительно хотите удалить пост ?')) {
            e.preventDefault();
            var nextElement = $(this).parents().eq(0).next();
            var id = nextElement.find('.number').text();
            var posts =  getPostsFromStorage();
            var x = posts.findIndex(x => x.id === parseInt(id));
            if (x !== -1) {
                posts.splice(x,1);
            }
            savePostsToStorage(posts);
            $(this).parents().eq(1).remove();
            $.iaoAlert({msg: "Вы удалили пост!",type: "error",mode: "dark"});
        }
    });


    $(document).on('click', '#btn-edit', function (e) {
        e.preventDefault();
        var userData;
        var nextElement = $(this).parents().eq(0).next();
        var id = nextElement.find('.number').text();
        var posts =  getPostsFromStorage();
        var x = posts.findIndex(x => x.id === parseInt(id));
        if (x !== -1) {
            userData = posts[x];
        } else {
            console.log('Запись не найдена');
            return false;
        }
        $('#country').val(userData.country);
        $('#date').val(userData.date);
        $('#text').val(userData.text);
        $('#id').val(userData.id);
        $('#btn-addPost').attr('id', 'btn-editPost').html('Edit Post');
        $.iaoAlert({msg: "Вы в режиме редактирования.", type: "notification", mode: "dark"});
    });

    $(document).on('click', '#btn-editPost', function (e) {
        e.preventDefault();
        var userData = {};
        userData.country = $('#country').val();
        userData.date = $('#date').val();
        userData.text = $('#text').val();
        userData.id = parseInt($('#id').val());
        var posts =  getPostsFromStorage();
        var x = posts.findIndex(x => x.id === parseInt(userData.id));
        posts[x] = userData;
        savePostsToStorage(posts);
        $(this).attr('id', 'btn-addPost').html('Add Post');
        $.iaoAlert({msg: "Вы изменили пост!", type: "notification", mode: "dark"});
        $('#postForm').trigger("reset");
        setTimeout(function(){location.reload();}, 2000);
    });

    $(document).on('change', '#country', function () {
        $.ajax({
            method: 'GET',
            url: 'https://restcountries.eu/rest/v2/name/' + $(this).val(),
            success: function (response) {
                var data = response[0];
                $('.form-container').css({'background': 'url('+ data.flag +') 50% 50% no-repeat', 'background-size': 'cover', 'background-blend-mode': 'hard-light'});
            },
            error: function () {
                $('.form-container').css({'background': 'rgba(255,255,255,0.1)'});
            }
        });
    });
});