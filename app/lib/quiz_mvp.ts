export interface QuizOption {
    id: string;
    testo: string;
    corretta: boolean;
  }
  
  export interface QuizStep {
    id: number;
    percorso: string;
    domanda: string;
    opzioni: QuizOption[];
    responso_dettagliato: { [key: string]: string };
    curiosita: {
      titolo: string;
      testo: string;
      url_immagine: string;
      tag_visual: string;
    };
  }
  
  export const quizData: QuizStep[] = [
   {
      "id":1,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Qual è l'ingrediente più importante nel dentifricio per la prevenzione attiva della carie?",
      "opzioni":[
         {
            "id":"A",
            "testo":"Il Fluoro",
            "corretta":true
         },
         {
            "id":"B",
            "testo":"La Silice (Silica)",
            "corretta":false
         },
         {
            "id":"C",
            "testo":"Il Sodio Laurilsolfato (SLS)",
            "corretta":false
         },
         {
            "id":"D",
            "testo":"La Menta",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"IL FLUORO (Il Protettore): È l'unico minerale che favorisce attivamente la rimineralizzazione dello smalto tramite la formazione di fluoroapatite.",
         "B":"LA SILICE (L'Abrasivo): Ha una funzione puramente meccanica di rimozione delle macchie superficiali, ma non previene chimicamente la carie.",
         "C":"IL SODIO LAURILSOLFATO (Lo Schiumogeno): Un tensioattivo che crea schiuma; utile per la distribuzione del prodotto ma potenzialmente irritante.",
         "D":"LA MENTA (L'Illusionista): Serve esclusivamente per l'esperienza sensoriale (alito fresco) e non ha proprietà terapeutiche."
      },
      "curiosita":{
         "titolo":"🧐lo sapevi che...",
         "testo":"Sputare il dentifricio senza risciacquare con acqua raddoppia l'efficacia del fluoro? Lasciarlo agire sulla superficie dei denti permette una protezione continua anche dopo il lavaggio.",
         "url_immagine":"assets/img/curiosita/no-rinse-technique.png",
         "tag_visual":"infografica_educativa"
      }
   },
   {
      "id":2,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Hai mai notato la sigla 'RDA' sulla confezione del dentifricio? Cosa indica esattamente?",
      "opzioni":[
         {
            "id":"A",
            "testo":"La quantità di fluoro per grammo",
            "corretta":false
         },
         {
            "id":"B",
            "testo":"Il livello di abrasività dello smalto",
            "corretta":true
         },
         {
            "id":"C",
            "testo":"La freschezza dell'aroma alla menta",
            "corretta":false
         },
         {
            "id":"D",
            "testo":"La data di scadenza del prodotto",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"SBAGLIATO: Il contenuto di fluoro è espresso in ppm (parti per milione).",
         "B":"CORRETTO: RDA sta per Relative Dentin Abrasivity. Misura quanto il dentifricio 'consuma' meccanicamente la dentina e lo smalto. Un valore sopra i 100 è considerato alto, sopra i 150 potenzialmente dannoso per un uso quotidiano.",
         "C":"SBAGLIATO: La freschezza non ha una sigla tecnica universale, è soggettiva.",
         "D":"SBAGLIATO: La scadenza è solitamente indicata dal simbolo PAO (un barattolo aperto con un numero di mesi)."
      },
      "curiosita":{
         "titolo":"🧐lo sapevi che...",
         "testo":"Molti dentifrici 'sbiancanti' hanno un RDA molto alto. In realtà non cambiano il colore chimico dei denti, ma 'grattano' via le macchie esterne. Se usati troppo spesso, possono assottigliare lo smalto rivelando la dentina sottostante, che è gialla: il risultato? Denti più gialli e più sensibili!",
         "url_immagine":"assets/img/curiosita/rda-chart-abrasivity.png",
         "tag_visual":"grafico_comparativo"
      }
   },
   {
      "id":3,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Masticare una gomma dopo i pasti può davvero aiutare i denti?",
      "opzioni":[
         {
            "id":"A",
            "testo":"No, serve solo a rinfrescare l'alito",
            "corretta":false
         },
         {
            "id":"B",
            "testo":"Sì, perché la gomma 'incolla' e rimuove i resti di cibo",
            "corretta":false
         },
         {
            "id":"C",
            "testo":"Sì, perché stimola la produzione di saliva",
            "corretta":true
         },
         {
            "id":"D",
            "testo":"No, il movimento della masticazione rovina sempre lo smalto",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"SBAGLIATO: L'alito fresco è solo un effetto collaterale. Il beneficio reale è chimico e meccanico.",
         "B":"PARZIALMENTE VERO: Può aiutare a rimuovere residui grossolani, ma non è il motivo principale della protezione anti-carie.",
         "C":"CORRETTO: La masticazione stimola il flusso salivare fino a 10 volte. La saliva è il miglior 'autolavaggio' naturale: neutralizza gli acidi della placca e apporta minerali (calcio e fosfati) che riparano lo smalto.",
         "D":"SBAGLIATO: Lo smalto è troppo duro per essere rovinato dalla gomma. Il problema semmai può riguardare i muscoli della mascella (ATM) se masticata per ore."
      },
      "curiosita":{
         "titolo":"🧐lo sapevi che...",
         "testo":"Il segreto è lo Xilitolo! Molte gomme usano questo dolcificante che i batteri della carie (Streptococcus mutans) 'mangiano' pensando sia zucchero, ma non riescono a digerirlo. Risultato? I batteri muoiono di fame e la tua bocca resta più sana. (Fonte: Journal of American Dental Association).",
         "url_immagine":"assets/img/curiosita/saliva-buffer-effect.png",
         "tag_visual":"schema_biochimico"
      }
   },
   {
      "id":4,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Oltre ai benefici per la saliva, qual è il principale limite 'fisico' consigliato dai dentisti riguardo all'uso delle gomme?",
      "opzioni":[
         {
            "id":"A",
            "testo":"Nessuno, si possono masticare senza vincoli effettivi",
            "corretta":false
         },
         {
            "id":"B",
            "testo":"Non superare i 20 minuti per non affaticare la mandibola",
            "corretta":true
         },
         {
            "id":"C",
            "testo":"Masticare solo con i denti anteriori",
            "corretta":false
         },
         {
            "id":"D",
            "testo":"Masticare solo dal lato sinistro",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"SBAGLIATO: Una masticazione continua può causare ipertrofia dei muscoli masseteri e stressare inutilmente l'articolazione.",
         "B":"CORRETTO: I dentisti consigliano di non superare i 15-20 minuti. Oltre questo tempo, l'articolazione temporo-mandibolare (ATM) viene sovraccaricata, potendo causare mal di testa, click mandibolari o dolori cervicali.",
         "C":"SBAGLIATO: La masticazione corretta deve coinvolgere i molari, ma per un tempo limitato.",
         "D":"SBAGLIATO: La masticazione unilaterale è dannosa perché crea asimmetria e squilibrio muscolare."
      },
      "curiosita":{
         "titolo":"🧐lo sapevi che...",
         "testo":"Le gomme comuni NON sono biodegradabili: la 'gomma base' è un mix di polimeri sintetici derivati dal petrolio (praticamente plastica!). Se gettate a terra, impiegano circa 5 anni per degradarsi in microplastiche, ma non scompaiono mai del tutto dal pianeta. Sono il secondo rifiuto più diffuso al mondo dopo i mozziconi di sigaretta.",
         "url_immagine":"assets/img/curiosita/gum-environment-impact.png",
         "tag_visual":"infografica_ambiente"
      }
   },
   {
      "id":5,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Qual è il momento migliore per utilizzare il collutorio durante la tua routine?",
      "opzioni":[
         {
            "id":"A",
            "testo":"Immediatamente dopo aver lavato i denti",
            "corretta":false
         },
         {
            "id":"B",
            "testo":"In un momento della giornata lontano dallo spazzolino",
            "corretta":true
         },
         {
            "id":"C",
            "testo":"Prima di iniziare a spazzolare",
            "corretta":false
         },
         {
            "id":"D",
            "testo":"Solo una volta alla settimana",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"SBAGLIATO: Se lo usi subito dopo, il collutorio 'lava via' l'alta concentrazione di fluoro lasciata dal dentifricio, riducendo la protezione dello smalto.",
         "B":"CORRETTO: L'ideale è usarlo dopo pranzo o durante il pomeriggio. Serve a rinfrescare e a dare una 'botta' di fluoro o antibatterici quando l'effetto del dentifricio del mattino è ormai svanito.",
         "C":"SBAGLIATO: Usarlo prima non è dannoso, ma è poco efficace perché la placca presente impedisce ai principi attivi di toccare il dente.",
         "D":"SBAGLIATO: Può essere usato quotidianamente, purché non contenga clorexidina ad alte percentuali per lunghi periodi (che può macchiare i denti)."
      },
      "curiosita":{
         "titolo":"Ma lo sapevi che...",
         "testo":"La scienza lo chiama 'Effetto Wash-out'. Il dentifricio ha circa 1450 ppm di fluoro, il collutorio solo 200-250 ppm. Se sciacqui subito, passi da una protezione altissima a una molto più blanda. Aspetta almeno 30 minuti!",
         "url_immagine":"assets/img/curiosita/washout-effect.png",
         "tag_visual":"grafico_concentrazione_fluoro"
      }
   },
   {
      "id":6,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Perché molti collutori moderni sono pubblicizzati come 'efficaci contro il 99% dei batteri'?",
      "opzioni":[
         {
            "id":"A",
            "testo":"Perché la loro azione chimica scioglie la placca batterica in pochi secondi",
            "corretta":false
         },
         {
            "id":"B",
            "testo":"Perché possono penetrare nel biofilm batterico senza bisogno di spazzolare",
            "corretta":false
         },
         {
            "id":"C",
            "testo":"Perché uccidono i batteri sospesi nella saliva, ma non quelli attaccati ai denti",
            "corretta":true
         },
         {
            "id":"D",
            "testo":"Perché contengono sostanze acide che rendono il dente inattaccabile",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"SBAGLIATO: Magari! La placca (biofilm) è una struttura incredibilmente resistente. Nessun collutorio sicuro per l'uomo è in grado di scioglierla chimicamente.",
         "B":"SBAGLIATO: Il biofilm batterico è una 'fortezza' protetta da una matrice di zuccheri e proteine. Il collutorio scivola sopra questa barriera senza riuscire a penetrarla.",
         "C":"CORRETTO: Il collutorio è un ottimo supporto perché abbatte la carica batterica 'libera' (nella saliva e sulle mucose), ma è totalmente inefficace contro i batteri organizzati nella placca. Quelli si rimuovono solo meccanicamente.",
         "D":"SBAGLIATO: Al contrario! Le sostanze acide sono il nemico numero uno dello smalto; i collutori sono studiati per essere a pH neutro o basico."
      },
      "curiosita":{
         "titolo":"L'illusione della freschezza🍋‍🟩",
         "testo":"Affidarsi solo al collutorio è come spruzzare profumo su una camicia sporca: l'odore è gradevole, ma le macchie restano. La placca è una pellicola gommosa e tenace che aderisce fisicamente al dente; senza l'azione meccanica delle setole che la 'distruggono', i batteri continuano a produrre acidi indisturbati sotto lo strato di liquido profumato.",
         "url_immagine":"assets/img/curiosita/mouthwash-vs-brush.png",
         "tag_visual":"infografica_meccanica_vs_chimica"
      }
   },
   {
      "id":7,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Perché a volte il filo interdentale emana un cattivo odore dopo essere stato passato tra i denti?",
      "opzioni":[
         {
            "id":"A",
            "testo":"È l'odore normale del materiale sintetico di cui è fatto il filo",
            "corretta":false
         },
         {
            "id":"B",
            "testo":"Indica che la placca batterica è rimasta intrappolata troppo a lungo",
            "corretta":true
         },
         {
            "id":"C",
            "testo":"È causato dal contatto del filo con la saliva acida",
            "corretta":false
         },
         {
            "id":"D",
            "testo":"Significa che il filo è di scarsa qualità e sta perdendo fibre",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"SBAGLIATO: Il filo è inerte e inodore. L'odore che senti è di origine organica.",
         "B":"CORRETTO: Quell'odore è il segnale che tra i denti si è formata una colonia di batteri anaerobi. Questi batteri, in assenza di ossigeno, decompongono i residui alimentari producendo gas (composti volatili dello zolfo) simili a quelli delle carie.",
         "C":"SBAGLIATO: La saliva sana è quasi inodore; il problema non è la saliva ma ciò che è nascosto negli spazi stretti.",
         "D":"SBAGLIATO: La qualità del filo influisce sulla resistenza, ma l'odore è un indicatore biologico della presenza di placca 'vecchia'."
      },
      "curiosita":{
         "titolo":"Il test del 'naso' non mente 👃",
         "testo":"Se il filo puzza, hai appena scoperto una zona dove lo spazzolino non arriva e dove i batteri stanno banchettando da giorni. È il primo segnale di un'infiammazione gengivale o di una carie interdentale in fase iniziale. Non smettere di usarlo: l'odore sparirà solo quando avrai rimosso tutta la placca accumulata!",
         "url_immagine":"assets/img/curiosita/floss-odor-test.png",
         "tag_visual":"infografica_batteri_anaerobi"
      }
   },
   {
      "id":8,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Se noti del sangue o un colore rosso acceso sulle gengive dopo il lavaggio, qual è la reazione più corretta?",
      "opzioni":[
         {
            "id":"A",
            "testo":"Smettere di spazzolare per qualche giorno per farle guarire",
            "corretta":false
         },
         {
            "id":"B",
            "testo":"Spazzolare con più attenzione proprio in quel punto, nonostante il sangue",
            "corretta":true
         },
         {
            "id":"C",
            "testo":"Cambiare dentifricio perché quello in uso è troppo 'forte'",
            "corretta":false
         },
         {
            "id":"D",
            "testo":"Usare solo collutorio finché il rossore non scompare",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"SBAGLIATO: L'assenza di spazzolamento permette alla placca di accumularsi ulteriormente, peggiorando l'infiammazione e creando un circolo vizioso pericoloso.",
         "B":"CORRETTO: Il sangue è il segnale che i batteri della placca stanno irritando i tessuti. Continuare a rimuovere la placca meccanicamente è l'unico modo per far regredire l'infiammazione e far tornare la gengiva sana (rosa e compatta).",
         "C":"SBAGLIATO: Raramente il dentifricio causa sanguinamento. Il problema è quasi sempre la placca batterica non rimossa correttamente.",
         "D":"SBAGLIATO: Il collutorio non rimuove la causa del sanguinamento (la placca). Senza l'azione meccanica delle setole, l'infiammazione persisterà."
      },
      "curiosita":{
         "titolo":"Il colore della salute❤️‍🩹",
         "testo":"Una gengiva sana non deve mai sanguinare, né durante il lavaggio né durante l'uso del filo. Deve apparire di colore 'rosa corallo' e avere una trama simile alla buccia d'arancia. Se è rosso vivo, lucida e gonfia, hai una gengivite in corso!",
         "url_immagine":"assets/img/curiosita/healthy-vs-inflamed-gums.png",
         "tag_visual":"comparazione_gengive_rosa_vs_rosse"
      }
   },
   {
      "id":9,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Cosa accade all'ecosistema della bocca se utilizziamo costantemente prodotti mirati allo sterminio totale della carica batterica?",
      "opzioni":[
         {
            "id":"A",
            "testo":"Si raggiunge uno stato di igiene assoluta che azzera il rischio di malattie",
            "corretta":false
         },
         {
            "id":"B",
            "testo":"Si crea un vuoto biologico che facilita la colonizzazione di funghi e specie resistenti",
            "corretta":true
         },
         {
            "id":"C",
            "testo":"Lo smalto diventa più poroso per permettere ai tessuti di respirare meglio",
            "corretta":false
         },
         {
            "id":"D",
            "testo":"I recettori del gusto si rigenerano più velocemente migliorando la percezione dei sapori",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"SBAGLIATO: L'igiene 'sterile' non esiste in natura. Eliminare i batteri protettivi lascia spazio a microrganismi opportunisti molto più aggressivi.",
         "B":"CORRETTO: Si chiama 'Disbiosi'. I batteri buoni occupano spazio e consumano nutrienti, impedendo ai patogeni (come la Candida) di proliferare. Senza di loro, la bocca perde la sua prima linea di difesa naturale.",
         "C":"SBAGLIATO: Non esiste correlazione tra carica batterica e porosità dello smalto in questo senso.",
         "D":"SBAGLIATO: Al contrario, l'abuso di sostanze chimiche aggressive può alterare temporaneamente la percezione del gusto."
      },
      "curiosita":{
         "titolo":"L'effetto 'terra bruciata'🔥",
         "testo":"I batteri della bocca non sono inquilini abusivi, ma parte del tuo sistema immunitario. Alcuni di essi trasformano i nitrati delle verdure in ossido nitrico, fondamentale per regolare la tua pressione sanguigna. Lavare i denti serve a gestire la densità della placca, non a 'disinfettare' un ambiente che per natura deve essere vivo.",
         "url_immagine":"assets/img/curiosita/microbiome-shield.png",
         "tag_visual":"infografica_biodiversita_orale"
      }
   },
   {
      "id":10,
      "percorso":"Il dentifricio (e i suoi amici)",
      "domanda":"Qual è il pericolo più sottovalutato per lo spazzolino quando lo lasciamo nel bicchiere sul lavandino?",
      "opzioni":[
         {
            "id":"A",
            "testo":"Che le setole si secchino troppo diventando dure",
            "corretta":false
         },
         {
            "id":"B",
            "testo":"La 'nuvola' di batteri che si alza quando tiriamo lo sciacquone",
            "corretta":true
         },
         {
            "id":"C",
            "testo":"Il contatto con la polvere che vola nell'aria di casa",
            "corretta":false
         },
         {
            "id":"D",
            "testo":"L'umidità del bagno che danneggia lo spazzolino",
            "corretta":false
         }
      ],
      "responso_dettagliato":{
         "A":"SBAGLIATO: In realtà le setole preferiscono asciugarsi all'aria; il problema è cosa c'è nell'aria!",
         "B":"CORRETTO: Si chiama 'Toilet Plume'. Ogni volta che tiri lo sciacquone con la tavoletta alzata, microscopiche goccioline cariche di batteri intestinali volano nel bagno e possono atterrare proprio sulle setole dello spazzolino.",
         "C":"SBAGLIATO: La polvere non è il massimo, ma i batteri che arrivano dal WC sono una minaccia molto più seria per la tua igiene.",
         "D":"SBAGLIATO: La plastica è fatta per resistere all'umidità, il vero rischio è biologico, non strutturale."
      },
      "curiosita":{
         "titolo":"La regola d'oro del bagno🚽",
         "testo":"Esiste un modo semplicissimo per salvare lo spazzolino: abbassare sempre il coperchio del WC prima di tirare l'acqua. E un altro trucco: non usare il cappuccio di plastica se lo spazzolino è ancora umido, perché crea una 'serra' perfetta per la crescita di muffe e batteri tra le setole!",
         "url_immagine":"assets/img/curiosita/toilet-aerosol-effect.png",
         "tag_visual":"schema_flusso_aria_bagno"
      }
   }
]