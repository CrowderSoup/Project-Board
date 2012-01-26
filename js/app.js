var projects = artemia.getStore({type : 'local', base : 'Projects'});
var notes = artemia.getStore({type : 'local', base : 'Notes'});
        
$(document).ready(function(){
    $("button").button();
    
    $("#SaveNote_BTN").click(function() {
        SaveNote();
    });
    
    $("#add_proj_dialog").dialog({ 
                                    modal: true, 
                                    autoOpen: false,
                                    height: 350,
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
    $('#color_picker_e').colorpicker({
                                size: 15,
                                label: 'Project Color: '
                            });
    
    $('#proj_due').datepicker();
    $('#proj_due_e').datepicker();
    
    $("#drill_into_proj").dialog({ 
                                    modal: true, 
                                    autoOpen: false,
                                    height: 600,
                                    width: 980,
                                    buttons: {
                                                "Ok": function() { $('#drill_into_proj').dialog('close'); },
                                                "Edit": function() { 
                                                                        $('#add_proj_dialog').dialog('close');
                                                                        editItem($("#proj_id_dd").html());
                                                                     }
                                             }
                                });
    
    $("#edit_proj_dialog").dialog({ 
                                    modal: true, 
                                    autoOpen: false,
                                    height: 350,
                                    width: 540,
                                    buttons: {
                                                "Save": function() { finish_editItem(); },
                                                "Cancel": function() { $('#edit_proj_dialog').dialog('close'); }
                                             }
                                });
    
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
            $("#" + proj[i].location).append('<div id="' + proj[i].key + '" class="draggable grid_2" style="background-color: #' + proj[i].color + ';">' + 
                                                proj[i].name +
                                                '<br/><center><a href="#" onclick="drillInto(' + proj[i].key + ');">View</a> | <a href="#" onclick="editItem(' + proj[i].key + ');">Edit</a></center>' +
                                             '</div>');
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
    
    var proj_name = $("#new_project").val();
    $("#new_project").val("");
    
    $("#new_body").append('<div id="' + date + '" class="draggable grid_2" style="background-color: #AFAFAF;">' + 
                            proj_name +
                            '<br/><center><a href="#" onclick="drillInto(' + date + ');">View</a> | <a href="#" onclick="editItem(' + date + ');">Edit</a></center>' +
                          '</div>');
    reInit();
    
    //Save the project to localStorage()
    var proj = {
                    key: date,
                    name: proj_name,
                    color: 'AFAFAF',
                    description: '',
                    due: '',
                    url: '',
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
    
    var proj_name = $("#proj_name").val();
    
    $("#new_body").append('<div id="' + date + '" class="draggable grid_2" style="background-color: #' + $("#color_picker option:selected").text() + ';">' + 
                            proj_name +
                            '<br/><center><a href="#" onclick="drillInto(' + date + ');">View</a> | <a href="#" onclick="editItem(' + date + ');">Edit</a></center>' +
                          '</div>');
    reInit();
    
    //Save the project to localStorage()
    var proj = {
                    key: date,
                    name: proj_name,
                    color: $("#color_picker option:selected").text(),
                    description: $("#proj_description").val(),
                    due: $("#proj_due").val(),
                    url: $("#proj_url").val(),
                    location: 'new_body'
               };
    projects.save(proj, function(r) { /*callback function*/ });
    
    $("#add_proj_dialog").dialog("close");
    $("#new_project").val("");
    $("#proj_name").val("");
    $("#proj_due").val("");
    $("#proj_description").val("");
}

function drillInto($id)
{
    projects.get($id, function(r) {
        $("#proj_name_dd").html(r.name);
        $("#proj_due_dd").html(r.due);
        $("#proj_description_dd").html(r.description);
        $("#proj_id_dd").html(r.key);
        $("#proj_url_dd").attr('href', r.url);
        $("#proj_url_dd").html(r.url);
        
        GetNotes();
        
        $("#drill_into_proj").dialog("open");
    });
}

function editItem($id)
{
    projects.get($id, function(r) {
        $("#proj_name_e").val(r.name);
        $("#proj_due_e").val(r.due);
        $("#proj_url_e").val(r.url);
        $("#proj_description_e").val(r.description);
        $("#proj_id_e").html(r.key);
        $("#proj_loc_e").html(r.location);
        $('#color_picker_e option').eq(r.color).attr('selected', 'selected');
        
        $("#edit_proj_dialog").dialog("open");
    });
}

function finish_editItem()
{    
    //Save the project to localStorage()
    var proj = {
                    key: $("#proj_id_e").html(),
                    name: $("#proj_name_e").val(),
                    color: $("#color_picker_e option:selected").text(),
                    description: $("#proj_description_e").val(),
                    due: $("#proj_due_e").val(),
                    url: $("#proj_url_e").val(),
                    location: $("#proj_loc_e").html()
               };
    projects.save(proj, function(r) { /*callback function*/ });
    
    window.location.reload();
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

function clearLocalStorage()
{
    projects.drop(function(r) { /*callback function*/ });
    notes.drop(function(r) { /*callback function*/ });
    window.location.reload();
}

/*-----------------------------------------
    Notes
-----------------------------------------*/
var GetProjectNotes = function(note) {
    if(note.projID == $("#proj_id_dd").html())
        return note
};

function SortNotes(a, b)
{
    return b.key - a.key
}

function GetNotes()
{
    var noteSTR = "";

    notes.query(GetProjectNotes, function(r) {
        r.sort(SortNotes);
        
        var i;
        for(i = 0; i < r.length; i += 1 ) {
            var date = new Date(r[i].key * 1);
            var dateSTR = date.toString();
            var dateARR = dateSTR.split("GMT");
            dateSTR = dateARR[0];
            
            noteSTR += "<p>" + r[i].body + "<br/><br/><i>Posted On: " + dateSTR + "</i></p>";
        }
    });
    
    $("#dd_Notes").html(noteSTR);
}

function SaveNote()
{
    if($("#NewNoteBody").val() != "")
    {
        var date = new Date().getTime();
        
        var note = {
                        key: date,
                        projID: $("#proj_id_dd").html(),
                        body: $("#NewNoteBody").val()
                   };
        notes.save(note, function(r) {  });
        
        $("#NewNoteBody").val("");
        GetNotes();
    }
    else
        alert("You must enter a note before saving it.");
}