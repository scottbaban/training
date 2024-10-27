# Copyright (c) 2024, Scott Baban and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Competition(Document):
    pass

@frappe.whitelist()
def get_game_list(competition_name):
    # Fetch games related to the current competition's sport
    games = frappe.get_all('Game', filters={'competition': competition_name}, fields=['sport', 'start_date', 'end_date', 'duration'])

    if not games:
        return "<p>No games found for this competition.</p>"

    # Build an HTML table for displaying games
    game_table = "<table class='table table-bordered'>"
    game_table += "<tr><th>Sport</th><th>Start Date</th><th>End Date</th><th>Duration</th></tr>"

    for game in games:
        game_table += f"<tr><td>{game.sport}</td><td>{game.start_date}</td><td>{game.end_date}</td><td>{game.duration}</td></tr>"

    game_table += "</table>"
    
    return game_table
