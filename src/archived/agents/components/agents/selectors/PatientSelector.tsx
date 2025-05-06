
import React from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { mockPatients } from "../utils/predefinedData";

interface PatientSelectorProps {
  selectedPatient: any;
  onPatientSelect: (patient: any) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
  selectedPatient,
  onPatientSelect,
}) => {
  const [open, setOpen] = React.useState(false);

  const handlePatientSelect = (patient: any) => {
    onPatientSelect(patient);
    setOpen(false);
  };

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Select Patient</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedPatient ? (
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {selectedPatient.name}
              </div>
            ) : (
              "Select patient..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search patients..." />
            <CommandEmpty>No patient found.</CommandEmpty>
            <CommandList>
              <CommandGroup heading="Patients">
                {mockPatients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.id}
                    onSelect={() => handlePatientSelect(patient)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPatient?.id === patient.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{patient.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {patient.age} years, {patient.gender}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PatientSelector;
