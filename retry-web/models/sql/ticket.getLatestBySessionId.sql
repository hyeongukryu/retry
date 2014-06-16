SELECT 
ticket.ticketId
FROM ticket
WHERE ticket.sessionId = ?
ORDER BY ticket.ticketId DESC
LIMIT 1