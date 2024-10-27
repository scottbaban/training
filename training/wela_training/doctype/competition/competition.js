frappe.ui.form.on('Competition', {
    refresh: function(frm) {
        frm.add_custom_button(__('Make Game'), function() {
            frappe.new_doc('Game', {
                competition: frm.doc.name,
                sport: frm.doc.sport
            }).then(function(game_doc) {
                frappe.set_route('Form', 'Game', game_doc.name);
            });
        });

        frm.add_custom_button(__('Get Athletes'), async function() {
            const sport = frm.doc.sport;  
            console.log('Selected sport:', sport);

            if (!sport || sport === "") { 
                frappe.msgprint("Please select a sport.");
                return;
            }

            try {
                const athletes = await frappe.db.get_list('Athlete', {
                    filters: { sports: sport },  
                    fields: ['name']
                });

                if (athletes.length === 0) {
                    frappe.msgprint(`No athletes found for the selected sport: ${sport}`);
                    return;
                }

                frm.clear_table("participants");

                athletes.forEach(athlete => {
                    let row = frm.add_child("participants");
                    row.athlete = athlete.name;
                });

                frm.refresh_field('participants');
                frappe.msgprint(`${athletes.length} athletes added to the Participants table.`);
            } catch (error) {
                console.error("Error fetching athletes:", error);
                frappe.msgprint("An error occurred while fetching athletes.");
            }
        });
    },

    after_save: function(frm) {
        update_game_table(frm);  
    }
});

function update_game_table(frm) {
    frappe.call({
        method: 'training.wela_training.doctype.competition.competition.get_game_list',
        args: { competition_name: frm.doc.name },
        callback: function(r) {
            if (r.message) {
                frm.set_df_property('games_html', 'options', r.message);
            }
        }
    });
}