var projects = new Array();
        
$(document).ready(function(){
    $("button").button();
    
    $("#add_proj_dialog").dialog({ 
                                    modal: true, 
                                    autoOpen: false,
                                    height: 200,
                                    width: 400,
                                    buttons: {
                                                "Save": function() { save_project(); },
                                                "Cancel": function() { $('#add_proj_dialog').dialog('close') }
                                             }
                                });
    
    $('#color_picker').colorpicker({
                                size: 15,
                                label: 'Project Color: '
                            });
    
    $('.draggable').draggable({ 
                                cancel: "a.ui-icon", 
                                revert: "invalid",
                                helper: "clone"
                              });
    $('.container').droppable({ 
            drop: function( event, ui )
            {
                addItem( ui.draggable, $(this) );
			}
    });
        
    $('#trash_body').droppable({ 
            drop: function( event, ui )
            {
        		deleteItem( ui.draggable );
			}
    });
    
//            $('#done_body').droppable({ 
//                    drop: function( event, ui )
//                    {
//                    	deleteItem( ui.draggable );
//        			  }
//            });
    
    $("#new_project").keyup(function(event){
          if(event.keyCode == 13){
            quick_add_project();
          }
        });

    if("Projects" in localStorage)
    {
        projects = localStorage.getItem("Projects");
        
        if(projects != "")
        {
            projects = projects.split(";");
            
            for(var i in projects)
            {
                var project = projects[i].split("|");
                $("#new_body").append('<div id="' + project[0] + '" class="draggable grid_2">' + project[1] + '</div>');
            }
            reInit();
        }
        else
        {
            projects = new Array();
        }
    }
});

function deleteItem($item)
{
    $item.fadeOut();
    var id = $($item).attr('id');
    
    if("Projects" in localStorage)
    {
        var temp_proj = localStorage.getItem("Projects");
        temp_proj = temp_proj.split(";");
        
        for(var i in temp_proj)
        {
            var proj = temp_proj[i].split("|");
            if(proj[0] == id)
            {
                temp_proj.splice(i, 1);
            }
        }
        
        try {
            localStorage.removeItem("Projects");
            localStorage.setItem("Projects", temp_proj.join(";")); //store the item in the database
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) 
            {
	            alert("Quota exceeded!");
            }
        }
    }
}

function addItem($item, $new_parent)
{
    $new_parent.append($item);
}

function quick_add_project()
{
    var date = new Date().getTime();
    
    $proj_name = $("#new_project").val();
    $("#new_project").val("");
    
    $("#new_body").append('<div id="' + date + '" class="draggable grid_2">' + $proj_name + '</div>');
    reInit();
    
    //Save the project to localStorage()
    projects.push(date + "|" + $proj_name);
    
    try {
        localStorage.setItem("Projects", projects.join(";")); //store the item in the database
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) 
        {
            alert("Quota exceeded!");
        }
    }
}

function add_project()
{
    $("#add_proj_dialog").dialog("open");
    
    //Set Project Name
    $("#proj_name").val($("#new_project").val());
}

function save_project()
{    
    var date = new Date().getTime();
    
    $proj_name = $("#proj_name").val();
    $("#new_project").val("");
    $("#proj_name").val("");
    
    $("#new_body").append('<div id="' + date + '" class="draggable grid_2">' + $proj_name + '</div>');
    reInit();
    
    //Save the project to localStorage()
    projects.push(date + "|" + $proj_name);
    
    try {
        localStorage.setItem("Projects", projects.join(";")); //store the item in the database
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) 
        {
            alert("Quota exceeded!");
        }
    }
    
    $("#add_proj_dialog").dialog("close");
}

function reInit()
{
    $('.draggable').draggable('destroy');
    $('.draggable').draggable({ 
                                cancel: "a.ui-icon", 
                                revert: "invalid",
                                helper: "clone"
                              });
}

function clearLocalStorage(area)
{
    localStorage.removeItem(area);
    window.location.reload();
}