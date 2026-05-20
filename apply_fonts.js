const fs=require('fs');
const files=['Carrinho.tsx','Chat.tsx','HomeComprador.tsx','Notificacao.tsx','ProdutoDetalhes.tsx','Receitas.tsx', 'Perfil.tsx'];
files.forEach(f=>{
  try{
    let p='frontend/src/pages/Comprador/'+f;
    let c=fs.readFileSync(p,'utf8');
    c=c.replace(/font-sans/g,'font-inter');
    c=c.replace(/<h([1-3])([^>]*)className="([^"]*)"/g,(m,p1,p2,p3)=>!p3.includes('font-poppins')?`<h${p1}${p2}className="font-poppins ${p3}"`:m);
    c=c.replace(/<h4([^>]*)className="([^"]*)"/g,(m,p1,p2)=>!p2.includes('font-montserrat')?`<h4${p1}className="font-montserrat ${p2}"`:m);
    fs.writeFileSync(p,c);
    console.log(f + ' updated');
  }catch(e){
    console.log('Error in ' + f + ': ' + e.message);
  }
});
