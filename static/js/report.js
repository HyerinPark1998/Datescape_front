



//카테고리 가져요기
var response_ids = {}
var access = localStorage.getItem("access")
async function categorySelectGet(category) {
    var id_name = category.id
    const response = await fetch(`${back_base_url}/reports/category/?id=${id_name}`, {
        method: "GET",
    });

    if (response.status == 200) {
        response_ids[id_name] = await response.json();
        create_category = createSelectCategory(response_ids[id_name])
        category.appendChild(create_category)

        return;
    } else {
        alert(response.status);
    }
}

var category_class = document.getElementsByClassName("category-select")
for (var i = 0; i < category_class.length; i++) {
    var category = category_class[i]
    categorySelectGet(category)
}

var save_status = {}


function createSelectCategory(category_list) {
    var div = document.createElement("div")
    var label = document.createElement('label')
    div.appendChild(label)
    label.forName = "content"
    label.className = "form-label"
    label.innerText = category_list[1]

    var select = document.createElement('select')
    div.appendChild(select)
    select.id = category_list[0]
    select.className = "reports-category"
    select.addEventListener('change', function () {

        if (category_list[2][select.selectedIndex - 1].length == 2) {
            save_status["save"] = true
            save_status["data"] = category_list[2][select.selectedIndex - 1][0]
            while (true) {
                if (select.nextSibling == null) {
                    break;
                }
                select.nextSibling.remove()
            }
        }
        else {
            save_status["save"] = false
            var child_category = createSelectCategory(category_list[2][select.selectedIndex - 1])
            select.parentElement.appendChild(child_category)
        }
    })
    select.style = "width:600px;height:25px;"


    var option = document.createElement('option')
    option.innerText = "---선택---"
    option.selected = true
    option.disabled = true
    option.hidden = true
    select.appendChild(option)
    category_list[2].forEach(function (element) {
        var option = document.createElement('option')
        option.innerText = element[1]
        select.appendChild(option)
    });


    return div

}

document.getElementById("save_db").addEventListener("click", function () {
    userReport()
})
async function userReport() {
    if (save_status["save"]) {
        const content = document.getElementById("content").value;
        const formData = new FormData();
        formData.append('request_type', "user")
        formData.append('report_id', 1)
        formData.append('report_type', save_status["data"])
        formData.append('comment', content)
        const response = await fetch(`${back_base_url}/reports/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.error(data);
    }
}