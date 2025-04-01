{
  pkgs,
  lib,
  config,
  ...
}: {
  # https://devenv.sh/languages/javascript/
  languages = {
    nix = {
      enable = true;
      lsp.package = pkgs.nixd;
    };

    javascript = {
      enable = true;
      npm = {
        enable = true;
        install.enable = true;
      };
    };

    typescript = {
      enable = true;
    };
  };

  packages = [
    pkgs.typescript
    pkgs.eslint_d
    pkgs.biome
    pkgs.vscode-js-debug
    pkgs.statix
    pkgs.alejandra
    pkgs.nixd
    pkgs.statix
  ];
}
