import SparqlClient from "sparql-http-client";

const endpointUrl = "https://dati.cultura.gov.it/sparql";
const query = (city) => `
  SELECT ?bc 
         (SAMPLE(STR(?label)) AS ?label) 
         (SAMPLE(?date) AS ?date) 
         (SAMPLE(?description) AS ?description) 
         (SAMPLE(?historicalInformation) AS ?historicalInformation) 
         (SAMPLE(?materialAndTechnique) AS ?materialAndTechnique) 
         (SAMPLE(?preview) AS ?preview)
  FROM <https://w3id.org/arco/data> 
  {
    ?bc a-cat:isDescribedByCatalogueRecord ?r ;
        rdfs:label ?label ;
        dc:date ?date ;
        dc:description ?description ;
        a-cd:historicalInformation ?historicalInformation ;
        pico:materialAndTechnique ?materialAndTechnique ;
        pico:preview ?preview ;
        a-loc:hasCulturalPropertyAddress/clvapit:hasCity <https://w3id.org/arco/resource/City/${city}> .
    FILTER (LANG(?label) = "it")
  }
  GROUP BY ?bc
  ORDER BY ?bc
  LIMIT 100
`;

const client = new SparqlClient({ endpointUrl });

export default function fetchData(city) {
  return new Promise((resolve, reject) => {
    const stream = client.query.select(query(city));
    const results = [];

    stream.on("data", (row) => {
      const jsonRow = {};
      for (const [key, value] of Object.entries(row))
        jsonRow[key] = value.value.charAt(0).toUpperCase() + value.value.slice(1);
      results.push(jsonRow);
    });

    stream.on("end", () => resolve(results));
    stream.on("error", (err) => reject(err));
  });
}
