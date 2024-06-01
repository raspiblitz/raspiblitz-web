{
  description = "A mobile-first responsive Web UI for the RaspiBlitz";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs @ {
    self,
    nixpkgs,
    flake-utils,
  }: let
    name = "blitz-web";

    systems =
      flake-utils.lib.eachDefaultSystem
      (system: let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        packages = {
          default = self.packages.${system}.${name};
          ${name} =
            pkgs.buildNpmPackage
            {
              name = "${name}";
              buildInputs = [pkgs.nodejs_22];
              src = ./.;

              npmDepsHash = "sha256-DT5+1KH06cMLHgMMPIiL1LMfxoOM4i15Z1MQok/eLS8=";

              preBuild = ''
                sed -i "s(const BACKEND_SERVER = "http://localhost:8000";(const BACKEND_SERVER = "http://127.0.0.1";(" vite.config.ts
              '';

              installPhase = ''
                mkdir $out
                npm run build
                cp -r build/* $out
              '';
            };
        };

        devShells.default = pkgs.mkShell {
          inputsFrom = [self.packages.${system}.${name}];
          packages = with pkgs; [nodejs_22 alejandra];
        };
      });

    overlays.overlays = {
      default = final: prev: {
        ${name} = self.packages.${prev.stdenv.hostPlatform.system}.${name};
      };
    };

    module = {
      nixosModules.default = {
        pkgs,
        lib,
        config,
        ...
      }: {
        imports = [./modules/raspiblitz-web.nix];
        nixpkgs.overlays = [self.overlays.default];
      };
    };
  in
    systems // overlays // module;
}
