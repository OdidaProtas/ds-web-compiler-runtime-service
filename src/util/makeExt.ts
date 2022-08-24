export default function makeExt(lang) {
  if (lang === "javascript") {
    return "js";
  }

  if (lang === "python") {
    return "py";
  }

  if (lang === "java") {
    return lang;
  }

  if (lang === "c_cpp") {
    return "cpp";
  }

  if (lang === "ruby") {
    return "rb";
  }

  if (lang === "golang") {
    return "go";
  }
}
