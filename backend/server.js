const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;
const server = http.createServer(app);
const { driver } = require('./neo4jClient');


const io = new Server(server, {
    cors: {
      origin: ["http://localhost:8080", "http://localhost"], // Erlaube CORS-Anfragen von dieser Herkunft
      methods: ["GET", "POST"], // Erlaubte Methoden
    },
  });

io.on('connection', (socket) => {
    console.log('Ein neuer Client ist verbunden');

    socket.on('disconnect', () => {
        console.log('Client getrennt');
    });
});

// Test-Endpunkt, um sicherzustellen, dass der Server läuft
app.get('/', (req, res) => {
    res.send('Express mit Neo4j Backend läuft!');
});

/**
 * @param {string} id - The employee's unique identifier.
 * @returns {Object} An object containing the employee's details, their preferred features,
 * and their department if found. Returns a 404 error if the employee does not exist, and a 
 * 500 error if there is a server error.
 */
// Route, um einen Mitarbeiter und dessen zugehörige Daten abzurufen
app.get('/employee/:id', async (req, res) => {
    const session = driver.session();
    const employeeId = parseInt(req.params.id);

    try {
        const result = await session.run(
            `MATCH (e:Employee {id: $employeeId})
            OPTIONAL MATCH (e)-[:PREFERS]->(f:Feature)
            MATCH (e)-[:BELONGS_TO]->(d:Department)
            RETURN e AS employee, collect(f) AS features, d AS department
            `,
            { employeeId }
        );

        if (result.records.length === 0) {
            return res.status(404).send('Mitarbeiter nicht gefunden.');
        }

        const record = result.records[0];
        const employee = record.get('employee').properties;
        const features = record.get('features').map(feature => feature.properties);
        const department = record.get('department').properties;

        res.send({ employee, features, department });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ein Fehler ist aufgetreten.');
    } finally {
        await session.close();
    }
});

/**
 * @param {string} id - The employee's unique identifier as a route parameter.
 * @param {Object} query - An object containing the feature preferences: heightAdjustable, monitors, and volume.
 * @returns {string} A success message or an error status with a message.
 */
// Route, um die Präferenzen eines Mitarbeiters zu ändern.
app.put('/employee/:id', async (req, res) => {
    const { id } = req.params; // Die Employee-ID
    const { heightAdjustable, monitors, volume } = req.query; // Die übergebenen Feature-Werte
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (e:Employee {id: $id})
                 // Entfernen der bestehenden PREFERS-Beziehungen
                 OPTIONAL MATCH (e)-[r:PREFERS]->(f:Feature)
                 DELETE r
                 // Erstellen Sie neue PREFERS-Beziehungen zu den übergebenen Features
                 WITH e
                 MATCH (ha:Feature {type: 'HeightAdjustable', value: $heightAdjustable}),
                       (m:Feature {type: 'Monitors', value: $monitors}),
                       (v:Feature {type: 'Volume', value: $volume})
                 MERGE (e)-[:PREFERS]->(ha)
                 MERGE (e)-[:PREFERS]->(m)
                 MERGE (e)-[:PREFERS]->(v)
                 RETURN e`,
            {
                id: parseInt(id),
                heightAdjustable: parseInt(heightAdjustable),
                monitors: parseInt(monitors),
                volume: parseInt(volume)
            }
        );

        if (result.records.length === 0) {
            return res.status(404).send('Mitarbeiter nicht gefunden oder Update fehlgeschlagen.');
        }
        io.emit('prefUpdated', { message: 'Daten aktualisiert' });
        res.send('Mitarbeiterpräferenzen erfolgreich aktualisiert.');
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Ein Fehler ist aufgetreten.');
    } finally {
        await session.close();
    }
});

/**
 * @param {string} id - The unique identifier of the employee.
 * @returns {Object} An object indicating the desk assignment status and, 
 *                   if applicable, the desk details and features.
 */
// Überprüfung des MA, ob dieser einem Schreibtisch zugewiesen ist
app.get('/employee/:id/has-desk', async (req, res) => {
    const employeeId = parseInt(req.params.id);
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (e:Employee {id: $employeeId})-[:ASSIGNED_DESK]->(d:Desk)
             OPTIONAL MATCH (d)-[:HAS_FEATURE]->(f:Feature)
             RETURN d AS desk, COLLECT(f) AS features`,
            { employeeId }
        );

        if (result.records.length === 0) {
            // Kein Schreibtisch oder keine Features gefunden
            const hasDesk = false;
            res.send({ hasDesk });
        } else {
            // Extrahieren Sie den Schreibtisch und dessen Features aus dem Ergebnis
            const deskRecord = result.records[0];
            const desk = deskRecord.get('desk').properties;
            const features = deskRecord.get('features').map(featureRecord => featureRecord.properties);
            const hasDesk = true;

            res.send({ hasDesk, desk, features });
        }
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Ein Fehler ist aufgetreten.');
    } finally {
        await session.close();
    }
});

/**
 * @param {string} id - The unique identifier of the employee whose desk assignment is to be removed.
 * @returns {Object} An object containing a message about the operation result and, if applicable, the details of the employee and desk.
 */
// Eine Zuweisung zwischen MA und Schreibtisch aufheben
app.put('/employee/:id/remove-desk', async (req, res) => {
    const employeeId = parseInt(req.params.id);
    const session = driver.session();

    try {
        // Die Cypher-Abfrage entfernt die ASSIGNED_DESK-Beziehung zwischen dem Employee und dem Desk
        const result = await session.run(
            `MATCH (e:Employee {id: $employeeId})-[r:ASSIGNED_DESK]->(d:Desk)
             DELETE r
             RETURN e, d`,
            { employeeId }
        );

        if (result.records.length === 0) {
            // Keine Beziehung gefunden, möglicherweise war dem Employee kein Desk zugewiesen
            res.send('Keine Verbindung zum Auflösen gefunden oder Mitarbeiter nicht vorhanden.');
        } else {
            // Erfolgreich die Beziehung aufgelöst
            const employee = result.records[0].get('e').properties;
            const desk = result.records[0].get('d').properties;
            io.emit('dataUpdated', { message: 'Daten aktualisiert' });
            res.send({ message: 'Verbindung zwischen Mitarbeiter und Schreibtisch erfolgreich aufgelöst.', employee, desk });
        }
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Ein Fehler ist aufgetreten.');
    } finally {
        await session.close();
    }
});

/**
 * @param {string} id - The unique identifier of the employee, passed as a route parameter.
 * @param {Object} query - The query object containing the deskId to be assigned.
 * @returns {string} A message indicating the result of the desk assignment operation.
 */
// Einem MA einen Schreibtisch zuweisen.
app.post('/employee/:id/assign-desk', async (req, res) => {
    console.log(req.query.deskId);
    const deskId = parseInt(req.query.deskId);
    console.log(deskId);
    const employeeId = parseInt(req.params.id);
    const session = driver.session();

    try {
        // Überprüfen, ob der Employee und der Desk existieren und keine bestehende ASSIGNED_DESK-Beziehung haben
        const checkResult = await session.run(
            `MATCH (e:Employee {id: $employeeId}), (d:Desk {id: $deskId})
             WHERE NOT (e)-[:ASSIGNED_DESK]->() AND NOT ()-[:ASSIGNED_DESK]->(d)
             RETURN e, d`,
            { deskId, employeeId }
        );

        // Wenn keine Knoten gefunden wurden oder bereits Beziehungen bestehen
        if (checkResult.records.length === 0) {
            return res.status(404).send('Mitarbeiter oder Schreibtisch nicht gefunden, oder es besteht bereits eine Zuweisung.');
        }

        // Erstellen der ASSIGNED_DESK-Beziehung, wenn die Überprüfung erfolgreich war
        const result = await session.run(
            `MATCH (e:Employee {id: $employeeId}), (d:Desk {id: $deskId})
             MERGE (e)-[:ASSIGNED_DESK]->(d)
             RETURN e, d`,
            { deskId, employeeId }
        );
        io.emit('dataUpdated', { message: 'Daten aktualisiert' });
        res.send('Schreibtisch erfolgreich einem Mitarbeiter zugewiesen.');
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Ein Fehler ist aufgetreten.');
    } finally {
        await session.close();
    }
});

/**
 * @param {Object} req.query - The query parameters containing the feature requirements: heightAdjustable,
 *                             monitors, volume, and optionally, department.
 * @returns {Array} An array of desk objects, each with details about the desk, its features, its department,
 *                  and a score indicating how well it matches the requested features. Desks are sorted by their
 *                  scores in descending order to prioritize those that best match the requirements.
 */
// Ruft verfügbare Schreibtische ab, die übergebenen Kriterien erfüllen.
app.get('/desks', async (req, res) => {
    const session = driver.session();
    const { heightAdjustable, monitors, volume, department } = req.query;

    try {
        let query = `
        MATCH (d:Desk)-[:HAS_FEATURE]->(f:Feature)
        WHERE NOT EXISTS {(d)<-[:ASSIGNED_DESK]-(:Employee)}
        `;

        if (department) {
            query += `AND EXISTS {(d)-[:BELONGS_TO]->(:Department {name: $department})} `;
        }

        query += `
        WITH d, COLLECT(f) AS features
        WHERE 
          ANY(f IN features WHERE (f.type = 'HeightAdjustable' AND f.value >= $heightAdjustable)) AND
          ANY(f IN features WHERE (f.type = 'Monitors' AND f.value >= $monitors)) AND
          ANY(f IN features WHERE (f.type = 'Volume' AND f.value <= $volume))
        OPTIONAL MATCH (d)-[:BELONGS_TO]->(dep:Department)
        RETURN d AS desk, features, dep AS department
      `;

        const result = await session.run(query, {
            heightAdjustable: heightAdjustable ? parseInt(heightAdjustable) : undefined,
            monitors: monitors ? parseInt(monitors) : undefined,
            volume: volume ? parseInt(volume) : undefined,
            department
        });

        let desks = result.records.map(record => ({
            desk: record.get('desk').properties,
            features: record.get('features').map(f => f.properties),
            department: record.get('department')?.properties,
            score: 0 // Initialisiere den Score
        }));

        // Bewertung und Sortierung der Schreibtische
        function calculateScore(difference, scoreMapping) {
            return scoreMapping[difference] || 0; // Gibt den entsprechenden Score zurück oder 0, wenn kein Eintrag existiert
        }
        
        desks.forEach(desk => {
            desk.features.forEach(feature => {
                let difference; // Differenz zwischen Feature-Wert und Anfrageparameter
        
                if (feature.type === 'HeightAdjustable' && heightAdjustable) {
                    difference = Math.abs(feature.value.low - heightAdjustable);
                    // Angenommen, die exakte Übereinstimmung hat die höchste Priorität
                    desk.score += calculateScore(difference, {0: 2});
                }
        
                if (feature.type === 'Monitors' && monitors) {
                    difference = Math.abs(feature.value.low - monitors);
                    desk.score += calculateScore(difference, {0: 3, 1: 1, 2: 0});
                }
        
                if (feature.type === 'Volume' && volume) {
                    difference = Math.abs(feature.value.low - volume);
                    // Aktualisierte Score-Berechnung basierend auf der Annahme, dass die korrekten Parameter verwendet werden
                    desk.score += calculateScore(difference, {0: 5, 1: 4, 2: 2, 3: 1, 4: 0});
                }
            });
        });

        // Sortiere die Schreibtische absteigend nach ihrem Score
        desks.sort((a, b) => b.score - a.score);

        res.json(desks);
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Serverfehler');
    } finally {
        await session.close();
    }
});


/**
 * @returns {Object} An object containing the total number of desks, the number of occupied desks, and a list of
 *                   statistics by department, including the department name, total desks in the department, and
 *                   how many of those are occupied.
 */
// Auslastung jeweiliger Departments
app.get('/manager/desk-stats', async (req, res) => {
    const session = driver.session();
    try {
        // Abfrage für die Gesamtanzahl der Schreibtische pro Abteilung
        const totalDesksQuery = `
            MATCH (d:Desk)
            OPTIONAL MATCH (d)-[:BELONGS_TO]->(dep:Department)
            RETURN dep.name AS Department, COUNT(d) AS TotalDesks
            ORDER BY Department
        `;

        // Abfrage für die Anzahl der belegten Schreibtische pro Abteilung
        const occupiedDesksQuery = `
            MATCH (:Employee)-[:ASSIGNED_DESK]->(d:Desk)
            OPTIONAL MATCH (d)-[:BELONGS_TO]->(dep:Department)
            RETURN dep.name AS Department, COUNT(d) AS OccupiedDesks
            ORDER BY Department
        `;

        const totalDesksResult = await session.run(totalDesksQuery);
        const occupiedDesksResult = await session.run(occupiedDesksQuery);

        // Umwandeln der Ergebnisse in Maps für einfachen Zugriff
        const totalDesksMap = new Map(totalDesksResult.records.map(record => [record.get('Department'), record.get('TotalDesks').low]));
        const occupiedDesksMap = new Map(occupiedDesksResult.records.map(record => [record.get('Department'), record.get('OccupiedDesks').low]));

        // Kombinieren der Ergebnisse
        const statsByDepartment = Array.from(totalDesksMap.keys()).map(department => ({
            department: department || 'No Department',
            totalDesks: totalDesksMap.get(department) || 0,
            occupiedDesks: occupiedDesksMap.get(department) || 0
        }));

        // Gesamtzahlen berechnen
        const totalDesks = Array.from(totalDesksMap.values()).reduce((acc, curr) => acc + curr, 0);
        const totalOccupiedDesks = Array.from(occupiedDesksMap.values()).reduce((acc, curr) => acc + curr, 0);

        res.json({
            totalDesks,
            totalOccupiedDesks,
            statsByDepartment
        });
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Ein Fehler ist aufgetreten.');
    } finally {
        await session.close();
    }
});

/**
 * @returns {Object} An object containing two key sections: `detailed`, which breaks down the statistics by department and feature,
 *                   and `overall`, which provides a summary of the total desks and employees associated with each feature type and value.
 */
// Auswertung der Austattung von Schreibtischen und Mitarbeiter Präferenzen
app.get('/manager/evaluation', async (req, res) => {
    const session = driver.session();
    try {
        // Detaillierte Auswertung pro Department
        const detailedQuery = `
            MATCH (d:Desk)-[:HAS_FEATURE]->(f:Feature)<-[:PREFERS]-(e:Employee),
                  (d)-[:BELONGS_TO]->(depD:Department),
                  (e)-[:BELONGS_TO]->(depE:Department)
            WHERE depD = depE
            RETURN depD.name AS Department, f.type AS FeatureType, f.value AS FeatureValue,
                   COUNT(DISTINCT d) AS DeskCount, COUNT(DISTINCT e) AS EmployeeCount
            ORDER BY Department, FeatureType, FeatureValue
        `;

        // Gesamtauswertung unabhängig von Department
        const overallQuery = `
            MATCH (f:Feature)<-[:HAS_FEATURE]-(d:Desk)
            OPTIONAL MATCH (f)<-[:PREFERS]-(e:Employee)
            RETURN f.type AS FeatureType, f.value AS FeatureValue, 
                   COUNT(DISTINCT d) AS TotalDesks, COUNT(DISTINCT e) AS TotalEmployees
            ORDER BY FeatureType, FeatureValue
        `;

        const detailedResult = await session.run(detailedQuery);
        const overallResult = await session.run(overallQuery);

        // Verarbeitung der detaillierten Ergebnisse
        const organizedDetailedResults = detailedResult.records.reduce((acc, record) => {
            const department = record.get('Department');
            const featureType = record.get('FeatureType');
            const featureValue = record.get('FeatureValue');
            const deskCount = record.get('DeskCount').low;
            const employeeCount = record.get('EmployeeCount').low;

            if (!acc[department]) {
                acc[department] = { department, features: {} };
            }

            if (!acc[department].features[featureType]) {
                acc[department].features[featureType] = [];
            }

            acc[department].features[featureType].push({ featureValue, deskCount, employeeCount });

            return acc;
        }, {});

        // Umwandeln der organisierten detaillierten Ergebnisse in das gewünschte Array-Format
        const detailedResultsArray = Object.keys(organizedDetailedResults).map(department => ({
            department,
            features: Object.entries(organizedDetailedResults[department].features).map(([featureType, values]) => ({
                featureType,
                values
            }))
        }));

        // Verarbeitung der Gesamtergebnisse
        const organizedOverallResults = overallResult.records.reduce((acc, record) => {
            const featureType = record.get('FeatureType');
            if (!acc[featureType]) {
                acc[featureType] = [];
            }
            acc[featureType].push({
                featureValue: record.get('FeatureValue'),
                totalDesks: record.get('TotalDesks').low,
                totalEmployees: record.get('TotalEmployees').low
            });

            return acc;
        }, {});

        // Umwandeln der organisierten Gesamtergebnisse in das gewünschte Array-Format
        const overallResultsArray = Object.entries(organizedOverallResults).map(([featureType, values]) => ({
            featureType,
            values
        }));

        // Kombinieren und senden der Ergebnisse
        const combinedResults = {
            detailed: detailedResultsArray,
            overall: overallResultsArray
        };
        res.json(combinedResults);
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Ein Fehler ist aufgetreten.');
    } finally {
        await session.close();
    }
});

/**
 * @param {string} department - The name of the department to which the new employee will be associated, passed as a URL parameter.
 * @returns {Object} An object containing a success message and the ID of the newly created employee. If the specified department
 *                   does not exist or the employee could not be created, an error message is returned.
 */
// Anlegen eines neuen Mitarbeiters einer Abteilung
app.post('/manager/employee/:department', async (req, res) => {
    const departmentName = req.params.department; // Entfernen Sie die ID aus den übermittelten Daten
    const session = driver.session();
    console.log(departmentName);
    try {
        // Finde die höchste existierende ID und erhöhe sie um eins für den neuen Mitarbeiter
        const idQuery = `
            MATCH (e:Employee)
            RETURN COALESCE(MAX(e.id), 0) AS maxId
        `;
        const idResult = await session.run(idQuery);
        const maxId = Number(idResult.records[0].get('maxId'));
        const newId = maxId + 1; 

        // Erstelle einen neuen Mitarbeiter mit der nächsten verfügbaren ID
        const createQuery = `
            MATCH (dep:Department {name: $departmentName})
            CREATE (e:Employee {id: $newId})
            MERGE (e)-[:BELONGS_TO]->(dep)
            WITH e
            MERGE (haFeature:Feature {type: 'HeightAdjustable', value: 0})
            MERGE (e)-[:PREFERS]->(haFeature)
            MERGE (mFeature:Feature {type: 'Monitors', value: 1})
            MERGE (e)-[:PREFERS]->(mFeature)
            MERGE (vFeature:Feature {type: 'Volume', value: 5})
            MERGE (e)-[:PREFERS]->(vFeature)
            RETURN e AS employee
        `;
        const createResult = await session.run(createQuery, { newId: neo4j.int(newId), departmentName });
        if (createResult.records.length === 0) {
            return res.status(404).send('Department nicht gefunden oder Mitarbeiter konnte nicht erstellt werden.');
        } else {
            res.status(201).json({ message: 'Mitarbeiter angelegt', id:  newId });
        }
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Ein Fehler ist aufgetreten beim Anlegen des Mitarbeiters.');
    } finally {
        await session.close();
    }
});

/**
 * @param {string} id - The unique identifier of the employee to be deleted, passed as a URL parameter.
 * @returns {string} A confirmation message indicating the success of the deletion or an error message if the employee
 *                   cannot be found or if a server error occurs.
 */
// Mitarbeiter löschen
app.delete('/manager/employee/:id', async (req, res) => {
    const employeeId = parseInt(req.params.id);
    const session = driver.session();
    try {
        const query = `
            MATCH (e:Employee {id: $employeeId})
            DETACH DELETE e
            RETURN e
        `;
        const result = await session.run(query, { employeeId });
        if (result.records.length === 0) {
            return res.status(404).send('Mitarbeiter nicht gefunden.');
        } else {
            res.status(200).send('Mitarbeiter erfolgreich gelöscht.');
        }
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Ein Fehler ist aufgetreten beim Löschen des Mitarbeiters.');
    } finally {
        await session.close();
    }
});

app.get('/manager/departments', async (req, res) => {
    const session = driver.session();
    try {
        const query = `
            MATCH (dep:Department)
            RETURN dep.name AS name
            ORDER BY dep.name
        `;
        const result = await session.run(query);
        const departments = result.records.map(record => record.get('name'));

        res.json({ departments });
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).send('Ein Fehler ist aufgetreten beim Abrufen der Departments.');
    } finally {
        await session.close();
    }
});

server.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
