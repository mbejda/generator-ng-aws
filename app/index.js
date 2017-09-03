var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);


        /// save the module context
        this.moduleRoot = __dirname;


    }


    prompting() {

        return this.prompt([{
            type    : 'input',
            name    : 'name',
            message : 'Your project name',
            default : this.appname // Default to current folder name
        }]).then((answers) => {
            this.log('project name', answers.name);

            this.projectName = answers.name;




        });
    }

    method1() {

        let exists = this.fs.exists(this.destinationPath(this.projectName));

        if(exists){

            this.env.error("Project already exists in current directory.");

            return;

        }

    }
    method2() {

        var that = this;

        var done = that.async();

        let ngbin = `${that.moduleRoot}/../node_modules/.bin`;

        let command = `${ngbin}/ng`;

        this.spawnCommand(command,["new",that.projectName]).on('close', function () {

            let newRoot= `${that.destinationRoot()}/${that.projectName}`;

            that.destinationRoot(newRoot);

            that.log(`Project created ${that.projectName}`);

            done();

        }).on("error", function(error) {
            console.log("Error!!! : " + error);
            throw error;
        });


    }

    method3() {



        this.log('Installing AWS SDK');

        this.npmInstall(['aws-sdk'], { 'save': true });

        this.npmInstall(['amazon-cognito-identity-js'], { 'save': true });

        this.log('Installing AWS Typescrupt Types');

        this.npmInstall(['@types/node'], { 'save-dev': true });

        this.log('Installing Bootstrap');

        this.npmInstall(['@ng-bootstrap/ng-bootstrap'], { 'save': true });


    }

    method4() {

        this.log('Replacing files....');


        let templateDir = `${this.moduleRoot}/../app/templates`;

        this.fs.copy(
            `${templateDir}/app.module.ts`,
            this.destinationPath(`src/app/app.module.ts`));

        this.log('app.modules.ts replaced');

        this.fs.copy(
            `${templateDir}/tsconfig.app.json`,
            this.destinationPath(`src/tsconfig.app.json`));

        this.log('tsconfig.app.json replaced');


        this.fs.copy(
            `${templateDir}/tsconfig.spec.json`,
            this.destinationPath(`src/tsconfig.spec.json`));

        this.log('tsconfig.spec.json replaced');

    }
};
