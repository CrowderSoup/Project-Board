var projects = artemia.getStore({type : 'local', base : 'Projects'});
        
$(document).ready(function(){
    $("button").button();
    
    $("#add_proj_dialog").dialog({ 
                                    modal: true, 
                                    autoOpen: false,
                                    height: 300,
                                    width: 540,
                                    buttons: {
                                                "Save": function() { save_project(); },
                                                "Cancel": function() { 
                                                                        $('#add_proj_dialog').dialog('close');
                                                                        $("#new_project").val("");
                                                                        $("#proj_name").val("");
                                                                        $("#proj_due").val("");
                                                                        $("#proj_description").val("");
                                                                     }
                                             }
                                });
    
    $('#color_picker').colorpicker({
                                size: 15,
                                label: 'Project Color: '
                            });
    
    $('#proj_due').datepicker();
    
    $('.draggable').draggable({ 
                                cancel: "a.ui-icon", 
                                revert: "invalid",
                                helper: "clone"
                              });
    $('.container').droppable({ 
            drop: function( event, ui )
            {
                moveItem( ui.draggable, $(this) );
			}
    });
        
    $('#trash_body').droppable({ 
            drop: function( event, ui )
            {
        		deleteItem( ui.draggable );
			}
    });
    
    $("#new_project").keyup(function(event){
          if(event.keyCode == 13){
            quick_add_project();
          }
        });

    projects.all(function(proj)
    {
        var i;
        for(i = 0; i < proj.length; i += 1 )
        {
            $("#" + proj[i].location).append('<div id="' + proj[i].key + '" class="draggable grid_2" style="background-color: #' + proj[i].color + ';">' + proj[i].name + '</div>');
        }
        reInit();
    });
});

function deleteItem($item)
{
    $item.fadeOut();
    var id = $($item).attr('id');
    
    projects.remove(id, function(r) { /*callback function*/ });
}

function moveItem($item, $new_parent)
{
    $new_parent.append($item);
    
    var key = $($item).attr('id');
    
    projects.get(key, function(r) {
        r.location = $($new_parent).attr('id');
        projects.save(r, function(r) { /*callback function*/ });
    });
}

function quick_add_project()
{
    var date = new Date().getTime();
    
    $proj_name = $("#new_project").val();
    $("#new_project").val("");
    
    $("#new_body").append('<div id="' + date + '" class="draggable grid_2" style="background-color: #AFAFAF;">' + $proj_name + '</div>');
    reInit();
    
    //Save the project to localStorage()
    var proj = {
                    key: date,
                    name: $proj_name,
                    color: 'AFAFAF',
                    description: '',
                    due: '',
                    location: 'new_body'
               };
    projects.save(proj, function(r) { /*callback function*/ });
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
    
    $("#new_body").append('<div id="' + date + '" class="draggable grid_2" style="background-color: #' + $("#color_picker option:selected").text() + ';">' + $proj_name + '</div>');
    reInit();
    
    //Save the project to localStorage()
    var proj = {
                    key: date,
                    name: $proj_name,
                    color: $("#color_picker option:selected").text(),
                    description: $("#proj_description").val(),
                    due: $("#proj_due").val(),
                    location: 'new_body'
               };
    projects.save(proj, function(r) { /*callback function*/ });
    
    $("#add_proj_dialog").dialog("close");
    $("#new_project").val("");
    $("#proj_name").val("");
    $("#proj_due").val("");
    $("#proj_description").val("");
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
    projects.drop(function(r) { /*callback function*/ });
    window.location.reload();
}