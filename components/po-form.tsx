"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "./ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery, useAction } from "convex/react";
import { User } from "@clerk/nextjs/server";
import { useAuth, useUser } from "@clerk/nextjs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  File,
  Upload,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import { Resend } from "resend";
import { sendEmail } from "@/actions/send-email";

export const formSchema = z.object({
  email: z.string().email(),
  required_by: z.date({
    required_error: "A date is required",
  }),
  priority: z.enum(["High", "Medium", "Low"]),
  vendor: z.string({ required_error: "A vendor is required" }).min(2).max(50),
  expense_type: z.enum(["General", "Building", "Missions"]),
  event_name: z.enum([
    "Gala",
    "Easter",
    "Team Night",
    "Flourish",
    "First Responders Day",
    "Forged Men's Night",
    "NL Kids Blast",
    "Junior Camp",
    "Teen Camp",
    "Educator Appreciation Day",
    "Mother's Day/Parent & Child Dedications",
    "Freedom Sunday",
    "Men's Camp",
    "NL Girls: Bloom",
    "Family Conference",
    "YA Conference",
    "NL Marriage Retreat",
    "Pumpkin Patch",
    "Trunk or Treat",
    "World Outreach Sunday",
    "Walkthrough Bethlehem",
    "New Life Christmas Experience",
    "Not Related to Any Events",
  ]),
  ministry: z.enum([
    "Assimilation/Guest Experience",
    "Refreshment Cart",
    "Media and Production",
    "Worship Team",
    "NLK",
    "NLY",
    "NLYA",
    "Life Groups",
    "Facilities",
    "Grief and Care",
    "Hospitality",
    "Counselling",
    "Benevolence",
    "Outreach/Discipleship",
    "Volunteers",
    "Admin Expense: Meals/Gas/Supplies/Office",
  ]),
  isBudgeted: z.string(),
  budget_num: z.number(),
  item_name: z.string({ required_error: "Required" }).min(2).max(150),
  nonbudget_approval: z.optional(z.string()),
  amount: z.number(),
  message: z.optional(z.string().min(2).max(300)),
});

export function PoForm() {
  const addPO = useMutation(api.pos.createPO);
  const userInfo = useQuery(api.users.current);
  const currUser = useUser();
  const { toast } = useToast();
  enum ExpenseType {
    General = "General",
    Building = "Building",
    Missions = "Missions",
  }
  const expenseTypes: ExpenseType[] = [
    ExpenseType.General,
    ExpenseType.Building,
    ExpenseType.Missions,
  ];

  enum EventType {
    Gala = "Gala",
    Easter = "Easter",
    TeamNight = "Team Night",
    Flourish = "Flourish",
    FirstRespondersDay = "First Responders Day",
    ForgedMensNight = "Forged Men's Night",
    NLKidsBlast = "NL Kids Blast",
    JuniorCamp = "Junior Camp",
    TeenCamp = "Teen Camp",
    EducatorAppreciationDay = "Educator Appreciation Day",
    MothersDayParentChildDedications = "Mother's Day/Parent & Child Dedications",
    FreedomSunday = "Freedom Sunday",
    MensCamp = "Men's Camp",
    NLGirlsBloom = "NL Girls: Bloom",
    FamilyConference = "Family Conference",
    YAConference = "YA Conference",
    NLMarriageRetreat = "NL Marriage Retreat",
    PumpkinPatch = "Pumpkin Patch",
    TrunkOrTreat = "Trunk or Treat",
    WorldOutreachSunday = "World Outreach Sunday",
    WalkthroughBethlehem = "Walkthrough Bethlehem",
    NewLifeChristmasExperience = "New Life Christmas Experience",
    NotRelatedToAnyEvents = "Not Related to Any Events",
  }

  const eventTypes: EventType[] = [
    EventType.Gala,
    EventType.Easter,
    EventType.TeamNight,
    EventType.Flourish,
    EventType.FirstRespondersDay,
    EventType.ForgedMensNight,
    EventType.NLKidsBlast,
    EventType.JuniorCamp,
    EventType.TeenCamp,
    EventType.EducatorAppreciationDay,
    EventType.MothersDayParentChildDedications,
    EventType.FreedomSunday,
    EventType.MensCamp,
    EventType.NLGirlsBloom,
    EventType.FamilyConference,
    EventType.YAConference,
    EventType.NLMarriageRetreat,
    EventType.PumpkinPatch,
    EventType.TrunkOrTreat,
    EventType.WorldOutreachSunday,
    EventType.WalkthroughBethlehem,
    EventType.NewLifeChristmasExperience,
    EventType.NotRelatedToAnyEvents,
  ];

  enum MinistryType {
    AssimilationGuestExperience = "Assimilation/Guest Experience",
    RefreshmentCart = "Refreshment Cart",
    MediaAndProduction = "Media and Production",
    WorshipTeam = "Worship Team",
    NLK = "NLK",
    NLY = "NLY",
    NLYA = "NLYA",
    LifeGroups = "Life Groups",
    Facilities = "Facilities",
    GriefAndCare = "Grief and Care",
    Hospitality = "Hospitality",
    Counselling = "Counselling",
    Benevolence = "Benevolence",
    OutreachDiscipleship = "Outreach/Discipleship",
    Volunteers = "Volunteers",
    AdminExpenseMealsGasSuppliesOffice = "Admin Expense: Meals/Gas/Supplies/Office",
  }

  const ministryTypes: MinistryType[] = [
    MinistryType.AssimilationGuestExperience,
    MinistryType.RefreshmentCart,
    MinistryType.MediaAndProduction,
    MinistryType.WorshipTeam,
    MinistryType.NLK,
    MinistryType.NLY,
    MinistryType.NLYA,
    MinistryType.LifeGroups,
    MinistryType.Facilities,
    MinistryType.GriefAndCare,
    MinistryType.Hospitality,
    MinistryType.Counselling,
    MinistryType.Benevolence,
    MinistryType.OutreachDiscipleship,
    MinistryType.Volunteers,
    MinistryType.AdminExpenseMealsGasSuppliesOffice,
  ];

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isMinistryOpen, setIsMinistryOpen] = useState(false);
  const [isBudgetNumOpen, setIsBudgetNumOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  // const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const budgetNums = userInfo?.po_nums;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: currUser.user?.emailAddresses[0].emailAddress ?? "",
      item_name: "",
    },
  });

  const generateUploadUrl = useAction(api.files.generateUploadUrl);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // if (userInfo?.budget && Number(values.amount) > userInfo.budget) {
    //   alert("Amount exceeds your budget");
    //   return;
    // }

    let fileId = undefined;
    let fileName = undefined;

    if (file) {
      // Get the upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Failed to upload file: ${result.statusText}`);
      }

      // Get the storage ID from the response
      const { storageId } = await result.json();
      fileId = storageId;
      fileName = file.name;
    }

    if (!userInfo) {
      return;
    }

    const {
      email,
      amount,
      budget_num,
      event_name,
      expense_type,
      isBudgeted,
      item_name,
      message,
      ministry,
      nonbudget_approval,
      priority,
      required_by,
      vendor,
    } = values;

    const poId = await addPO({
      email,
      amount,
      budget_num,
      event_name,
      expense_type,
      isBudgeted,
      item_name,
      message,
      ministry,
      nonbudget_approval,
      priority,
      required_by: required_by.toString(),
      vendor,
      user: userInfo?._id,
      status: "pending",
      fileId,
      fileName,
    });

    console.log("poID: ", poId);
    toast({
      title: "PO Submitted ✅",
      description: "You have successfully submitted a PO.",
    });
    form.reset();
    form.resetField("priority");
    form.resetField("nonbudget_approval");
    setFile(null);

    sendEmail(values, poId);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 p-3 bg-background border h-fit rounded-lg md:w-3/4 w-full"
      >
        <h2 className="font-bold text-xl">PO Form</h2>
        <div className="flex md:flex-row flex-col items-center gap-4  w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel>
                  Email <span className="text-lg text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="test@findnewlife.church" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="required_by"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1 w-full">
                <FormLabel>
                  Required By <span className="text-lg text-red-400">*</span>
                </FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex md:flex-row flex-col items-start gap-4  w-full">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="space-y-3 w-full flex-1">
                <FormLabel>
                  Priority Level
                  <span className="text-lg ml-1 text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="High" />
                      </FormControl>
                      <FormLabel className="font-normal">High</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Medium" />
                      </FormControl>
                      <FormLabel className="font-normal">Medium</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Low" />
                      </FormControl>
                      <FormLabel className="font-normal">Low</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vendor"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>
                  Vendor(s) <span className="text-lg text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Amazon" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex md:flex-row flex-col items-center gap-4  w-full">
          <FormField
            control={form.control}
            name="expense_type"
            render={({ field }) => (
              <FormItem className="flex w-full flex-1 flex-col">
                <FormLabel>
                  Type of Expense
                  <span className="text-lg text-red-400">*</span>
                </FormLabel>
                <Popover open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "flex-1 justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? expenseTypes.find(
                              (expense) => expense === field.value
                            )
                          : "Select Expense"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      {/* <CommandInput placeholder="Search language..." /> */}
                      <CommandList>
                        <CommandGroup>
                          {expenseTypes.map((expense) => (
                            <CommandItem
                              value={expense}
                              key={expense}
                              onSelect={() => {
                                form.setValue("expense_type", expense);
                                setIsExpenseOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  expense === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {expense}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-1 flex-col">
                <FormLabel>
                  Event(s) <span className="text-lg text-red-400">*</span>
                </FormLabel>
                <Popover open={isEventOpen} onOpenChange={setIsEventOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? eventTypes.find((event) => event === field.value)
                          : "Select Event"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search event..." />
                      <CommandList>
                        <CommandGroup>
                          {eventTypes.map((event) => (
                            <CommandItem
                              value={event}
                              key={event}
                              onSelect={() => {
                                //@ts-ignore
                                form.setValue("event_name", event);
                                setIsEventOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  event === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {event}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex md:flex-row md:my-2 flex-col items-center gap-4 w-full">
          <FormField
            control={form.control}
            name="ministry"
            render={({ field }) => (
              <FormItem className="flex w-full md:w-1/2 flex-col">
                <FormLabel>
                  Ministry <span className="text-lg text-red-400">*</span>
                </FormLabel>
                <Popover open={isMinistryOpen} onOpenChange={setIsMinistryOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? ministryTypes.find(
                              (ministry) => ministry === field.value
                            )
                          : "Select Ministry"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandList>
                        <CommandGroup>
                          {ministryTypes.map((ministry) => (
                            <CommandItem
                              value={ministry}
                              key={ministry}
                              onSelect={() => {
                                form.setValue("ministry", ministry);
                                setIsMinistryOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  ministry === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {ministry}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="item_name"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>
                  Item(s) <span className="text-lg text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="phone charger" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex md:flex-row flex-col items-start gap-4 w-full">
          <FormField
            control={form.control}
            name="isBudgeted"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>
                  Is this PO Budgeted?
                  <span className="text-lg ml-1 text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget_num"
            render={({ field }) => (
              <FormItem className="flex mt-2 space-y-3 md:w-1/2 w-full flex-col">
                <FormLabel>Budget Number</FormLabel>

                <Popover
                  open={isBudgetNumOpen}
                  onOpenChange={setIsBudgetNumOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? budgetNums &&
                            budgetNums.find((num) => num === field.value)
                          : "Select budget number"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search budget number..." />
                      <CommandList>
                        <CommandGroup>
                          {budgetNums &&
                            budgetNums.map((num) => (
                              <CommandItem
                                value={num.toString()}
                                key={num}
                                onSelect={() => {
                                  form.setValue("budget_num", num);
                                  setIsBudgetNumOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    num === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {num}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex md:flex-row flex-col items-start gap-4 w-full">
          <FormField
            control={form.control}
            name="nonbudget_approval"
            render={({ field }) => (
              <FormItem className="flex mt-2 space-y-3 md:w-1/2 w-full flex-col">
                <FormLabel>
                  If not budgeted, who has approved your PO?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Sarona Arzoumanian" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Sarona Arzoumanian
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Peter Mordh" />
                      </FormControl>
                      <FormLabel className="font-normal">Peter Mordh</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex mt-2 md:w-1/2 space-y-3 w-full flex-col">
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Notes about purchase order"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What is the amount of the purchase order?
                <span className="text-lg ml-1 text-red-400">*</span>
              </FormLabel>
              <FormControl typeof="number">
                <Input
                  type="number"
                  placeholder="$200"
                  {...field}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <div className="flex flex-col">
            <Label className="text-base">Attachments</Label>
            {file && (
              <div className="flex text-blue-500 items-center gap-2">
                <File size={15} />
                <span className="text-sm">{file.name}</span>
                <X
                  onClick={() => setFile(null)}
                  className="ml-auto cursor-pointer text-red-500"
                />
              </div>
            )}
          </div>
          {!file && (
            <div className="grid w-full gap-1.5">
              <Label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
                <Input
                  id="file"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setFile(file);
                    }
                  }}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg"
                />
              </Label>
            </div>
          )}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
