import { StreamLanguage } from "@codemirror/language";
import { StreamParser } from "@codemirror/language";

const plantumlParser: StreamParser<unknown> = {
  token(stream) {
    // Comments
    if (stream.match(/^'.*$/)) {
      return "comment";
    }
    if (stream.match(/^\/'.*/)) {
      return "comment";
    }
    if (stream.match(/^\/\*.*/)) {
      return "comment";
    }

    // Start/End tags
    if (stream.match(/^@startuml|^@enduml|^@start|^@end/)) {
      return "keyword";
    }

    // Keywords and directives
    if (
      stream.match(
        /^(actor|participant|boundary|control|entity|database|collections|queue|component|package|node|cloud|interface|usecase|rectangle|class|abstract|annotation|enum|skinparam|title|header|footer|legend|note|activate|deactivate|destroy|create|autonumber|newpage|alt|else|opt|loop|par|break|critical|group|box|end|if|then|elseif|else|endif|while|endwhile|repeat|fork|again|start|stop|detach|split|kill|return|hide|show|left|right|up|down|top|bottom|over|of|on|as|is)\b/
      )
    ) {
      return "keyword";
    }

    // Arrows and operators
    if (stream.match(/^(->|-->|<-|<--|<->|<-->|->>|-->>|<<-|<<--|<->>|<<-->>|\|)/)) {
      return "operator";
    }

    // Strings
    if (stream.match(/^"([^"\\]|\\.)*"/)) {
      return "string";
    }

    // Colors and special values
    if (stream.match(/^#[0-9A-Fa-f]{6}\b/)) {
      return "number";
    }
    if (stream.match(/^(true|false|none|transparent|left|right|center)\b/)) {
      return "atom";
    }

    // Numbers
    if (stream.match(/^[0-9]+/)) {
      return "number";
    }

    // Identifiers (participant names, etc.)
    if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) {
      return "variableName";
    }

    // Special characters
    if (stream.match(/^[{}()\[\]:,;]/)) {
      return "punctuation";
    }

    stream.next();
    return null;
  },
};

export function plantuml() {
  return StreamLanguage.define(plantumlParser);
}
