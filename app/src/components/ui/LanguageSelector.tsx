import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";

export interface LanguageSelectorProps {
  locale: string;
  title: string;
  label: string;
}

export default function LanguageSelector({
  locale = "ar",
  title = "اللغة",
  label = "إختر اللغة",
}:
  Partial<LanguageSelectorProps>
) {
  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";

  return (
    <DropdownMenu dir={TEXT_DIRECTION}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={locale === "ar"}
          onCheckedChange={() => (window.location.href = "/")}
          dir="rtl"
        >
          العربية
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={locale === "en"}
          onCheckedChange={() => (window.location.href = "/en")}
        >
          English
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
