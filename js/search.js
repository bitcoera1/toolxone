/*
=========================================
TOOLXONE
Universal Search Engine
Version 2.2
=========================================
*/

function initializeSearch(){

    const input =
        document.getElementById("toolSearch");

    const results =
        document.getElementById("searchResults");

    if(!input || !results) return;

    const tools=[];

    TOOLXONE.categories.forEach(category=>{

        category.tools.forEach(tool=>{

            tools.push(tool);

        });

    });

    input.addEventListener("input",()=>{

        const query =
            input.value.toLowerCase().trim();

        results.innerHTML="";

        if(query===""){

            results.style.display="none";
            return;

        }

        const matches=
            tools.filter(tool=>

                tool.name
                .toLowerCase()
                .includes(query)

            );

        matches.forEach(tool=>{

            const item=
                document.createElement("div");

            item.className="search-item";

            item.textContent=
                tool.icon+" "+tool.name;

            item.onclick=()=>{

                window.location.href=
                    tool.link;

            };

            results.appendChild(item);

        });

        results.style.display=
            matches.length ? "block":"none";

    });

}