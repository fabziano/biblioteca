class EntidadeBibliografica {
    constructor(codigo, titulo, autor, ano) {
        this.codigo = codigo;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.isEmprestado = false;
        this.usuarioEmprestado = null;
    }

    emprestar(usuario) {
        if (!this.isEmprestado) {
            this.isEmprestado = true;
            this.usuarioEmprestado = usuario;
            console.log(`Item "${this.titulo}" emprestado para ${usuario.nome}`);
        } else {
            console.log(`Item "${this.titulo}" já emprestado`);
        }
    }

    devolver() {
        if (this.isEmprestado) {
            this.isEmprestado = false;
            this.usuarioEmprestado = null;
            console.log(`Item "${this.titulo}" devolvido`);
        } else {
            console.log(`Item "${this.titulo}" não estava emprestado`);
        }
    }
}

class Livro extends EntidadeBibliografica {
    constructor(codigo, titulo, autor, ano, genero) {
        super(codigo, titulo, autor, ano);
        this.genero = genero;
    }
}

class Revista extends EntidadeBibliografica {
    constructor(codigo, titulo, autor, ano) {
        super(codigo, titulo, autor, ano);
    }
}

class Usuario {
    constructor(nome, ra, dataNascimento) {
        this.nome = nome;
        this.ra = ra;
        this.dataNascimento = dataNascimento;
    }
}

class Biblioteca {
    constructor() {
        this.acervo = [];
        this.usuarios = [];
    }

    adicionarItem(item) {
        this.acervo.push(item);
        console.log(`Item "${item.titulo}" foi adicionado ao acervo.`);
    }

    listarAcervo() {
        const livros = this.acervo.filter(item => item instanceof Livro);
        const revistas = this.acervo.filter(item => item instanceof Revista);

        console.log('\n-- ACERVO DA BIBLIOTECA --');
        console.log('Livros:\n');
        livros.forEach((livro, index) => {
            console.log(`${index + 1}. Código: ${livro.codigo}, Título: ${livro.titulo}, Autor: ${livro.autor}, Ano: ${livro.ano} - ${livro.isEmprestado ? 'Emprestado' : 'Disponível'}`);
        });
        console.log('Revistas:\n');
        revistas.forEach((revista, index) => {
            console.log(`${index + 1}. Código: ${revista.codigo}, Título: ${revista.titulo}, Autor: ${revista.autor}, Ano: ${revista.ano} - ${revista.isEmprestado ? 'Emprestado' : 'Disponível'}`);
        });
        console.log('\n')
    }

    adicionarUser(user) {
        const usuarioExistente = this.usuarios.find(u => u.ra === user.ra);
    
        if (usuarioExistente) {
            console.log(`Usuário ${usuarioExistente.nome} com RA ${user.ra} já existe na biblioteca.`);
        } else {
            this.usuarios.push(user);
            console.log(`Usuário ${user.nome} com RA ${user.ra} foi adicionado como usuário da biblioteca.`);
        }
    }

    emprestarItem(cod, raUsuario) {
        const item = this.acervo.find(item => item.codigo === cod);

        if (!item) {
            console.log('Item não encontrado.');
            return;
        }

        const usuario = this.usuarios.find(user => user.ra === raUsuario);

        if (!usuario) {
            console.log(`Usuário com RA ${raUsuario} não encontrado.`);
            return;
        }

        item.emprestar(usuario);
    }

    devolverItem(cod, raUsuario) {
        const item = this.acervo.find(item => item.codigo === cod);
    
        if (!item) {
            console.log('Item não encontrado.');
            return;
        }
    
        const usuario = this.usuarios.find(user => user.ra === raUsuario);
    
        if (!usuario) {
            console.log(`Usuário com RA ${raUsuario} não encontrado.`);
            return;
        }
    
        if (item.isEmprestado && item.usuarioEmprestado.ra === raUsuario) {
            item.devolver();
        } else {
            console.log(`Usuário ${usuario.nome} com RA ${raUsuario} não pode devolver o item "${item.titulo}".`);
        }
    }
}

const Genero = {
    TERROR: 'Terror',
    COMEDIA: 'Comédia',
    FANTASIA: 'Fantasia',
    FICCAO: 'Ficção',
    SUSPENSE: 'Suspense',
    DRAMA: 'Drama',
    HISTORIA: 'História',
    POLICIAL: 'Policial',
    ROMANCE: 'Romance'
};

const biblioteca = new Biblioteca();

async function buscarAcervoDaAPI() {
    try {
        const response = await fetch('https://api-biblioteca-mb6w.onrender.com/acervo');
        const data = await response.json();

        data.forEach(itemData => {
            const { codigo, titulo, autor, anoPublicacao, genero, entidadeBibliografica } = itemData;

            if (entidadeBibliografica === 'Livro') {
                const livro = new Livro(codigo, titulo, autor, anoPublicacao, genero);
                biblioteca.adicionarItem(livro);
            } else if (entidadeBibliografica === 'Revista') {
                const revista = new Revista(codigo, titulo, autor, anoPublicacao);
                biblioteca.adicionarItem(revista);
            }
        });
    } catch (error) {
        console.error('Erro ao buscar acervo da API:', error);
    }
}

async function buscarUsuariosDaAPI() {
    try {
        const response = await fetch('https://api-biblioteca-mb6w.onrender.com/users');
        const data = await response.json();

        data.forEach(userData => {
            const { nome, registroAcademico, dataNascimento } = userData;
            const usuario = new Usuario(nome, registroAcademico, dataNascimento);
            biblioteca.adicionarUser(usuario);
        });
    } catch (error) {
        console.error('Erro ao buscar usuários da API:', error);
    }
}

async function main() {
    await buscarAcervoDaAPI();
    await buscarUsuariosDaAPI();

    biblioteca.listarAcervo();

    biblioteca.emprestarItem('LT456', '552031');
    biblioteca.emprestarItem('LC123', '11025'); 
    biblioteca.devolverItem('LT456', '552031');

    const novoUsuario = new Usuario('Fabiano', '14600', '1993-06-21');
    const novoUsuario2 = new Usuario('Pedro', '15600', '1993-06-21');
    const novoLivro = new Livro('LT678', 'O Hobbit', 'Autor do Novo Livro', 1937, Genero.FANTASIA);
    const novaRevista = new Revista('RN101', 'Istoé', 'Vários Autores', 2022);
    
    biblioteca.adicionarUser(novoUsuario);
    biblioteca.adicionarUser(novoUsuario2);
    biblioteca.adicionarItem(novoLivro);
    biblioteca.adicionarItem(novaRevista);

    biblioteca.listarAcervo();

    biblioteca.emprestarItem('LT678', '14600')

    biblioteca.devolverItem('LT678','32225')
}

main();
