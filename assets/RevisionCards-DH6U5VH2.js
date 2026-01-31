import{u as w,j as e}from"./index-Bc9gZLdS.js";import{r as o}from"./router-DFNW7_fs.js";import{L,s as H,J as m,K as k,m as C,N as M,A as R,O as T}from"./icons-7zPcJRMo.js";import"./react-vendor-ZjeaK7N3.js";import"./supabase-C8HnRnw-.js";const p={Mathematics:{"O/L":[{id:1,title:"Quadratic Formula",content:"x = (-b ± √(b² - 4ac)) / 2a",category:"Algebra"},{id:2,title:"Pythagoras Theorem",content:`a² + b² = c²

In a right triangle, the square of hypotenuse equals sum of squares of other two sides`,category:"Geometry"},{id:3,title:"Area Formulas",content:`• Circle: πr²
• Triangle: ½ × base × height
• Rectangle: length × width
• Trapezium: ½(a+b) × h`,category:"Mensuration"},{id:4,title:"Trigonometry Ratios",content:`sin θ = Opposite / Hypotenuse
cos θ = Adjacent / Hypotenuse
tan θ = Opposite / Adjacent

SOH CAH TOA`,category:"Trigonometry"},{id:5,title:"Probability",content:`P(Event) = Favorable Outcomes / Total Outcomes

0 ≤ P(E) ≤ 1
P(E) + P(E') = 1`,category:"Statistics"},{id:6,title:"Percentage Change",content:`% Change = ((New - Old) / Old) × 100

% Increase → Positive
% Decrease → Negative`,category:"Numbers"}],"A/L":[{id:7,title:"Derivatives",content:`d/dx (xⁿ) = nxⁿ⁻¹
d/dx (sin x) = cos x
d/dx (cos x) = -sin x
d/dx (eˣ) = eˣ
d/dx (ln x) = 1/x`,category:"Calculus"},{id:8,title:"Integration Rules",content:`∫xⁿ dx = xⁿ⁺¹/(n+1) + C
∫sin x dx = -cos x + C
∫cos x dx = sin x + C
∫eˣ dx = eˣ + C`,category:"Calculus"},{id:9,title:"Equations of Motion",content:`v = u + at
s = ut + ½at²
v² = u² + 2as
s = ½(u + v)t`,category:"Mechanics"},{id:10,title:"Complex Numbers",content:`i² = -1
|z| = √(a² + b²)
arg(z) = tan⁻¹(b/a)
z* = a - bi (conjugate)`,category:"Algebra"}]},Physics:{"O/L":[{id:11,title:"Newton's Laws",content:`1st: Object at rest stays at rest
2nd: F = ma
3rd: Every action has equal & opposite reaction`,category:"Mechanics"},{id:12,title:"Ohm's Law",content:`V = IR

V = Voltage (V)
I = Current (A)
R = Resistance (Ω)`,category:"Electricity"},{id:13,title:"Wave Equation",content:`v = fλ

v = velocity
f = frequency
λ = wavelength`,category:"Waves"}],"A/L":[{id:14,title:"Coulomb's Law",content:`F = kq₁q₂/r²

k = 9 × 10⁹ Nm²/C²`,category:"Electrostatics"},{id:15,title:"Capacitance",content:`C = Q/V
C = ε₀A/d (parallel plate)

Series: 1/C = 1/C₁ + 1/C₂
Parallel: C = C₁ + C₂`,category:"Electricity"},{id:16,title:"Photoelectric Effect",content:`E = hf = hc/λ
KE = hf - φ

h = 6.63 × 10⁻³⁴ Js`,category:"Modern Physics"},{id:17,title:"E = mc²",content:`Energy-Mass Equivalence

E = mc²
c = 3 × 10⁸ m/s`,category:"Modern Physics"}]},Chemistry:{"O/L":[{id:18,title:"pH Scale",content:`pH = -log[H⁺]

pH < 7: Acid
pH = 7: Neutral
pH > 7: Base`,category:"Acids & Bases"},{id:19,title:"Periodic Table Groups",content:`Group 1: Alkali Metals
Group 2: Alkaline Earth
Group 17: Halogens
Group 18: Noble Gases`,category:"Periodic Table"}],"A/L":[{id:20,title:"Ideal Gas Law",content:`PV = nRT

R = 8.314 J/mol·K

At STP:
T = 273K, P = 101.3 kPa`,category:"Physical Chemistry"},{id:21,title:"Organic Homologous Series",content:`Alkanes: CₙH₂ₙ₊₂
Alkenes: CₙH₂ₙ
Alkynes: CₙH₂ₙ₋₂
Alcohols: CₙH₂ₙ₊₁OH`,category:"Organic Chemistry"},{id:22,title:"Electrochemical Series",content:`K > Na > Ca > Mg > Al > Zn > Fe > H > Cu > Ag > Au

More reactive → Better reducing agent`,category:"Electrochemistry"}]},Biology:{"O/L":[{id:23,title:"Photosynthesis",content:`6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂

Light + Chlorophyll required
Occurs in chloroplasts`,category:"Plant Biology"},{id:24,title:"Respiration",content:`C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy

Aerobic: With oxygen
Anaerobic: Without oxygen`,category:"Cell Biology"}],"A/L":[{id:25,title:"DNA Structure",content:`A-T (2 H-bonds)
G-C (3 H-bonds)

Antiparallel strands
5' to 3' direction`,category:"Genetics"},{id:26,title:"Mendelian Ratios",content:`Monohybrid: 3:1
Dihybrid: 9:3:3:1
Test Cross: 1:1
Codominance: 1:2:1`,category:"Genetics"},{id:27,title:"Krebs Cycle",content:`Location: Mitochondria

Products per cycle:
• 3 NADH
• 1 FADH₂
• 1 ATP
• 2 CO₂`,category:"Biochemistry"}]},Economics:{"A/L":[{id:28,title:"GDP Formula",content:`GDP = C + I + G + (X - M)

C = Consumption
I = Investment
G = Government
X = Exports
M = Imports`,category:"Macroeconomics"},{id:29,title:"Price Elasticity",content:`Ed = (% Change in Qd) / (% Change in P)

Ed > 1: Elastic
Ed < 1: Inelastic
Ed = 1: Unit elastic`,category:"Microeconomics"},{id:30,title:"Inflation Types",content:`• Demand-Pull: Too much money
• Cost-Push: Rising production costs
• Built-in: Wage-price spiral`,category:"Macroeconomics"}]}};function q(){w("revision");const[l,j]=o.useState("Mathematics"),[c,g]=o.useState("O/L"),[h,r]=o.useState(0),[s,u]=o.useState(()=>{try{const t=localStorage.getItem("savedRevisionCards");return t?JSON.parse(t):[]}catch{return[]}}),[b,x]=o.useState(!0),[N,v]=o.useState(null);o.useEffect(()=>{localStorage.setItem("savedRevisionCards",JSON.stringify(s))},[s]);const a=p[l]?.[c]||[],i=a[h],A=()=>{r(t=>(t+1)%a.length),x(!0)},f=()=>{r(t=>(t-1+a.length)%a.length),x(!0)},y=t=>{s.find(n=>n.id===t.id)?u(s.filter(n=>n.id!==t.id)):u([...s,t])},d=t=>s.some(n=>n.id===t),O=t=>{const n=`📝 ${t.title}

${t.content}

- ${l} (${c})`;navigator.clipboard.writeText(n),v(t.id),setTimeout(()=>v(null),2e3)},S=t=>{const n=`📝 *${t.title}*

${t.content}

_${l} - ${c}_

📚 Get more at BrightMindAid`;window.open(`https://wa.me/?text=${encodeURIComponent(n)}`,"_blank")},E=()=>{if(s.length===0){alert("No saved cards to share");return}let t=`📚 *My Saved Revision Cards*

`;s.forEach((n,P)=>{t+=`${P+1}. *${n.title}*
${n.content}

`}),t+="_Generated from BrightMindAid_",window.open(`https://wa.me/?text=${encodeURIComponent(t)}`,"_blank")};return e.jsxs("div",{className:"container py-8",children:[e.jsxs("div",{className:"page-header",children:[e.jsxs("div",{className:"header-title-row",children:[e.jsx(L,{size:28,className:"header-icon"}),e.jsx("h1",{className:"text-3xl",children:"Quick Revision Cards"})]}),e.jsx("p",{className:"page-description",children:"Bite-sized revision cards with key formulas and concepts. Save, share, and study on the go!"})]}),e.jsxs("div",{className:"revision-filters",children:[e.jsxs("div",{className:"filter-group-inline",children:[e.jsx("label",{children:"Subject:"}),e.jsx("select",{value:l,onChange:t=>{j(t.target.value),r(0)},className:"filter-select-light",children:Object.keys(p).map(t=>e.jsx("option",{value:t,children:t},t))})]}),e.jsxs("div",{className:"level-toggle",children:[e.jsx("button",{className:`level-btn ${c==="O/L"?"active":""}`,onClick:()=>{g("O/L"),r(0)},children:"O/L"}),e.jsx("button",{className:`level-btn ${c==="A/L"?"active":""}`,onClick:()=>{g("A/L"),r(0)},children:"A/L"})]})]}),a.length>0?e.jsxs("div",{className:"card-viewer",children:[e.jsx("button",{className:"nav-arrow left",onClick:f,children:e.jsx(H,{size:24})}),e.jsxs("div",{className:"revision-card-container",children:[e.jsxs("div",{className:`revision-card ${b?"show":""}`,children:[e.jsx("div",{className:"card-category",children:i.category}),e.jsx("h3",{className:"card-title-big",children:i.title}),e.jsx("div",{className:"card-content-box",children:e.jsx("pre",{children:i.content})}),e.jsxs("div",{className:"card-actions-row",children:[e.jsx("button",{className:`card-action-btn ${d(i.id)?"saved":""}`,onClick:()=>y(i),title:d(i.id)?"Remove from saved":"Save card",children:e.jsx(m,{size:18,fill:d(i.id)?"currentColor":"none"})}),e.jsx("button",{className:`card-action-btn ${N===i.id?"copied":""}`,onClick:()=>O(i),title:"Copy to clipboard",children:e.jsx(k,{size:18})}),e.jsx("button",{className:"card-action-btn whatsapp",onClick:()=>S(i),title:"Share on WhatsApp",children:e.jsx(C,{size:18})})]})]}),e.jsxs("div",{className:"card-counter",children:[h+1," / ",a.length]})]}),e.jsx("button",{className:"nav-arrow right",onClick:A,children:e.jsx(M,{size:24})})]}):e.jsxs("div",{className:"no-cards",children:[e.jsx(R,{size:48}),e.jsx("p",{children:"No revision cards available for this selection."})]}),e.jsxs("div",{className:"cards-grid-section",children:[e.jsxs("h3",{children:[e.jsx(T,{size:18})," All Cards - ",l," (",c,")"]}),e.jsx("div",{className:"revision-cards-grid",children:a.map((t,n)=>e.jsxs("div",{className:`revision-card-mini ${h===n?"active":""}`,onClick:()=>r(n),children:[e.jsx("span",{className:"mini-category",children:t.category}),e.jsx("h4",{children:t.title}),d(t.id)&&e.jsx(m,{size:14,className:"saved-indicator"})]},t.id))})]}),s.length>0&&e.jsxs("div",{className:"saved-cards-section",children:[e.jsxs("div",{className:"saved-header",children:[e.jsxs("h3",{children:[e.jsx(m,{size:18})," Saved Cards (",s.length,")"]}),e.jsxs("button",{className:"btn-secondary btn-sm",onClick:E,children:[e.jsx(C,{size:14}),"Share All"]})]}),e.jsx("div",{className:"saved-cards-list",children:s.map(t=>e.jsxs("div",{className:"saved-card-item",children:[e.jsxs("div",{className:"saved-card-info",children:[e.jsx("h4",{children:t.title}),e.jsx("span",{children:t.category})]}),e.jsx("button",{className:"remove-btn",onClick:()=>y(t),children:"×"})]},t.id))})]})]})}export{q as default};
