"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
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
import { useUser } from "@clerk/nextjs";
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
  LoaderIcon,
  Upload,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import { sendEmail } from "@/actions/send-email";
import Alert from "./Alert"; // Import the Alert component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

export const formSchema = z
  .object({
    email: z.string().email(),
    required_by: z.date({
      required_error: "A date is required",
    }),
    // isSharing: z.string(),
    // share_user: z.string(),
    template: z.boolean().default(false),
    template_name: z.string(),
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
    budget_num: z.optional(z.number()),
    amount: z.number({ required_error: "At least one item is required" }),
    items: z.array(
      z.object({
        name: z.string().min(2, "Item name must be at least 2 characters"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price must be positive"),
      })
    ),
    nonbudget_approval: z.optional(z.string()),
    message: z.optional(z.string().min(2).max(300)),
  })
  .refine((data) => data.items.length > 0, {
    message: "At least one item is required",
    path: ["items"],
  });

type Item = {
  name: string;
  quantity: number;
  price: number;
};

export function PoForm({
  draft_id,
  template_id,
}: {
  draft_id: Id<"po_drafts">;
  template_id: Id<"pos">;
}) {
  const addPO = useMutation(api.pos.createPO);
  const userInfo = useQuery(api.users.current);
  const templateInfo = useQuery(api.pos.getTemplatePO, { poId: template_id });
  const draftInfo = useQuery(api.pos.getPODraft, { poDraft_id: draft_id });
  const allUsers = useQuery(api.users.getAllShareUsers);
  const createPODraft = useMutation(api.pos.createPODraft);
  const updateDraft = useMutation(api.pos.updateDraft);
  const deleteDraft = useMutation(api.pos.deleteDraft);
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
  const [isSharing, setIsSharing] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const budgetNums = userInfo?.po_nums;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor: draftInfo?.vendor ? draftInfo.vendor : templateInfo?.vendor ?? "",
      email: draftInfo?.email
        ? draftInfo.email
        : currUser.user?.emailAddresses[0].emailAddress ?? "",
      items: draftInfo?.item_name
        ? draftInfo.item_name
        : templateInfo?.item_name ?? [],
      priority: draftInfo?.priority
        ? draftInfo.priority
        : templateInfo?.priority ?? "Medium",
      expense_type: draftInfo?.expense_type
        ? draftInfo.expense_type
        : templateInfo?.expense_type,
      event_name: draftInfo?.event_name
        ? draftInfo.event_name
        : templateInfo?.event_name,
      ministry: draftInfo?.ministry
        ? draftInfo.ministry
        : templateInfo?.ministry,
      isBudgeted: draftInfo?.isBudgeted
        ? draftInfo.isBudgeted
        : templateInfo?.isBudgeted ?? "",
      budget_num: draftInfo?.budget_num
        ? draftInfo.budget_num
        : templateInfo?.budget_num,
      template_name: "",
    },
  });

  async function handleFileUpload() {
    let fileIds: string[] = [];
    let fileNames: string[] = [];
    if (files.length > 0) {
      // Upload each file and collect their IDs
      for (const file of files) {
        const uploadUrl = await generateUploadUrl();

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

        const { storageId } = await result.json();
        fileIds.push(storageId);
        fileNames.push(file.name);
      }
    }

    return { fileIds, fileNames };
  }

  async function handleCreateDraft() {
    if (!userInfo) {
      return;
    }

    const { fileIds, fileNames } = await handleFileUpload();

    if (draftInfo) {
      await updateDraft({
        draft_id: draftInfo._id,
        email: form.getValues().email,
        amount: form.getValues().amount,
        template: form.getValues().template,
        template_name: form.getValues().template_name,
        budget_num: form.getValues().budget_num,
        event_name: form.getValues().event_name,
        expense_type: form.getValues().expense_type,
        isBudgeted: form.getValues().isBudgeted,
        item_name: form.getValues().items,
        message: form.getValues().message,
        ministry: form.getValues().ministry,
        nonbudget_approval: form.getValues().nonbudget_approval,
        priority: form.getValues().priority,
        required_by: form.getValues().required_by.toString(),
        vendor: form.getValues().vendor,
        status: "pending",
        fileIds,
        fileNames,
      });

      toast({
        title: "PO Draft Updated 📃",
        description: "You can continue it later on.",
      });
    } else {
      const poId = await createPODraft({
        email: form.getValues().email,
        amount: form.getValues().amount,
        template: form.getValues().template,
        template_name: form.getValues().template_name,
        budget_num: form.getValues().budget_num,
        event_name: form.getValues().event_name,
        expense_type: form.getValues().expense_type,
        isBudgeted: form.getValues().isBudgeted,
        item_name: form.getValues().items,
        message: form.getValues().message,
        ministry: form.getValues().ministry,
        nonbudget_approval: form.getValues().nonbudget_approval,
        priority: form.getValues().priority,
        required_by: form.getValues()?.required_by?.toString(),
        vendor: form.getValues().vendor,
        user: userInfo?._id,
        status: "pending",
        fileIds,
        fileNames,
      });

      toast({
        title: "PO Saved As Draft 📃",
        description: "You can continue it later on.",
      });
      router.push("/create");
    }
  }

  useEffect(() => {
    if (draftInfo) {
      console.log("priority: ", draftInfo.priority);

      if (draftInfo.priority) {
        form.setValue("priority", draftInfo?.priority);
      }
      form.reset({
        vendor: draftInfo.vendor,
        email: draftInfo.email,
        items: draftInfo.item_name,
        required_by: draftInfo.required_by
          ? new Date(draftInfo.required_by)
          : new Date(),
        priority: draftInfo.priority,
        expense_type: draftInfo.expense_type,
        event_name: draftInfo.event_name,
        ministry: draftInfo.ministry,
        isBudgeted: draftInfo.isBudgeted,
        budget_num: draftInfo.budget_num,
        template_name: draftInfo.template_name,
        message: draftInfo.message,
      });
    }
    if (templateInfo) {
      form.reset({
        vendor: templateInfo.vendor,
        email: currUser.user?.emailAddresses[0].emailAddress,
        items: templateInfo.item_name,
        priority: templateInfo.priority,
        expense_type: templateInfo.expense_type,
        event_name: templateInfo.event_name,
        ministry: templateInfo.ministry,
        isBudgeted: templateInfo.isBudgeted,
        budget_num: templateInfo.budget_num,
        template_name: "",
      });
    }
  }, [templateInfo, draftInfo, currUser.user?.emailAddresses, form]);

  const generateUploadUrl = useAction(api.files.generateUploadUrl);
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const calculateTotal = (items: Item[]) => {
    let total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    form.setValue("amount", total);
    return total;
  };

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [
      ...currentItems,
      { name: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    form.setValue(
      "items",
      currentItems.filter((_, i) => i !== index)
    );
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // if (userInfo?.budget && Number(values.amount) > userInfo.budget) {
    //   alert("Amount exceeds your budget");
    //   return;
    // }
    if (!userInfo) {
      return;
    }
    setIsFormSubmitting(true);
    if (values.isBudgeted === "Yes" && !values.budget_num) {
      setAlertMessage("Since it is budgeted, a budget number is required.");
      return;
    }

    if (values.isBudgeted === "No" && !values.nonbudget_approval) {
      setAlertMessage("Non budgeted approval is required.");
      return;
    }

    const { fileIds, fileNames } = await handleFileUpload();

    const totalAmount = calculateTotal(values.items);

    if (draftInfo) {
      await deleteDraft({ draft_id: draftInfo._id });
      router.push("/create");
    }

    const poId = await addPO({
      email: values.email,
      amount: totalAmount,
      template: values.template,
      template_name: values.template_name,
      budget_num: values.budget_num,
      event_name: values.event_name,
      expense_type: values.expense_type,
      isBudgeted: values.isBudgeted,
      item_name: values.items,
      message: values.message,
      ministry: values.ministry,
      nonbudget_approval: values.nonbudget_approval,
      priority: values.priority,
      required_by: values.required_by.toString(),
      vendor: values.vendor,
      user: userInfo?._id,
      status: "pending",
      fileIds,
      fileNames,
    });

    toast({
      title: "PO Submitted ✅",
      description: "You have successfully submitted a PO.",
    });
    form.reset();
    form.resetField("priority");
    form.resetField("nonbudget_approval");
    form.resetField("message");
    setFiles([]);
    setIsFormSubmitting(false);
    sendEmail(values, poId);
  }

  const closeAlert = () => setAlertMessage(null);

  return (
    <>
      {alertMessage && <Alert message={alertMessage} onClose={closeAlert} />}
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
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
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
                    <Textarea
                      className="resize-none"
                      placeholder="Enter vendor name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex pb-2 md:flex-row flex-col items-center gap-4  w-full">
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
            <FormField
              control={form.control}
              name="ministry"
              render={({ field }) => (
                <FormItem className="flex w-full flex-1 flex-col">
                  <FormLabel>
                    Ministry <span className="text-lg text-red-400">*</span>
                  </FormLabel>
                  <Popover
                    open={isMinistryOpen}
                    onOpenChange={setIsMinistryOpen}
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
          </div>

          <div className="space-y-2 bg-secondary p-2 rounded-md">
            <div className="flex justify-between items-center">
              <Label>
                Line Items <span className="text-lg text-red-400">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </div>

            <Table className="bg-background rounded-md">
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.watch("items")?.length === 0 && (
                  <TableRow className="flex  w-full">
                    <TableCell colSpan={4}>
                      <p className="font-medium text-sm">No items added yet.</p>
                    </TableCell>
                  </TableRow>
                )}
                {form.watch("items")?.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Item name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={1}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={0}
                                step={0.01}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      $
                      {(
                        form.watch(`items.${index}.quantity`) *
                        form.watch(`items.${index}.price`)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {form.watch("items")?.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total Amount:
                    </TableCell>
                    <TableCell className="font-bold">
                      ${calculateTotal(form.watch("items")).toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {form.formState.errors.items && (
              <p className="text-sm text-red-500">
                {form.formState.errors.items.message}
              </p>
            )}
          </div>
          <div className="flex md:flex-row flex-col items-start gap-4 w-full">
            <FormField
              control={form.control}
              name="isBudgeted"
              render={({ field }) => (
                <FormItem className="md:w-1/2 w-full">
                  <FormLabel>
                    Is this Budgeted?
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
            {form.watch("isBudgeted") === "Yes" && (
              <FormField
                control={form.control}
                name="budget_num"
                render={({ field }) => (
                  <FormItem className="flex mt-2 space-y-2 md:w-1/2 w-full flex-col">
                    <FormLabel>
                      Budget Number
                      <span className="text-lg ml-1 text-red-400">*</span>
                    </FormLabel>

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
            )}
            {form.watch("isBudgeted") === "No" && (
              <FormField
                control={form.control}
                name="nonbudget_approval"
                render={({ field }) => (
                  <FormItem className="flex space-y-3 md:w-1/2 w-full flex-col">
                    <FormLabel>
                      If not budgeted, who has approved your PO?
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
                          <FormLabel className="font-normal">
                            Peter Mordh
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          {/* <div className="flex md:flex-row flex-col items-start gap-4 w-full">
            <FormField
              control={form.control}
              name="isSharing"
              render={({ field }) => (
                <FormItem className="md:w-1/2 w-full">
                  <FormLabel>Do you want to share this with someone?</FormLabel>
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
            {form.watch("isSharing") === "Yes" && (
              <FormField
                control={form.control}
                name="share_user"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-1 flex-col">
                    <FormLabel>
                      Staff Members
                      <span className="text-lg text-red-400"> *</span>
                    </FormLabel>
                    <Popover open={isSharing} onOpenChange={setIsSharing}>
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
                            {field.value ? field.value : "Select Staff"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          
                          <CommandList>
                            <CommandGroup>
                              {allUsers?.map((user) => (
                                <CommandItem
                                  value={user.name}
                                  key={user._id}
                                  onSelect={() => {
                                    form.setValue("share_user", user.name);
                                    setIsSharing(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      user.name === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {user.name}
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
            )}
          </div> */}
          <div className="flex md:flex-row flex-col items-start gap-4 w-full">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    What is the amount of the purchase order?
                    <span className="text-lg ml-1 text-red-400">*</span>
                  </FormLabel>
                  <FormControl typeof="number">
                    <Input
                      type="number"
                      disabled
                      value={field?.value?.toFixed(2)}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex mt-2 flex-1 space-y-3 w-full flex-col">
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

          <div className="space-y-2">
            <div className="flex flex-col">
              <Label className="text-base">Attachments</Label>
              {files.length > 0 && (
                <div className="flex  text-blue-500 items-center gap-2">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="flex text-blue-500 bg-secondary rounded-lg items-center gap-2"
                    >
                      <File size={15} />
                      <span className="text-sm">{file.name}</span>
                      <X
                        onClick={() => removeFile(file)}
                        className="ml-auto cursor-pointer text-red-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {files.length === 0 && (
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
                      const files = event.target.files;
                      if (files) {
                        setFiles(Array.from(files));
                      }
                    }}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg"
                  />
                </Label>
              </div>
            )}
          </div>
          {!templateInfo && (
            <>
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make Template</FormLabel>
                      <FormDescription>
                        This feature enables you to create similar purchase
                        orders more efficiently.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {form.watch("template") === true && (
                <FormField
                  control={form.control}
                  name="template_name"
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>
                        Name of Template{" "}
                        <span className="text-lg text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="resize-none"
                          placeholder="Enter template name"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}
          <section className="flex items-center pt-5 gap-2">
            <Button disabled={isFormSubmitting} type="submit">
              {isFormSubmitting ? (
                <section className="flex items-center gap-2">
                  <LoaderIcon className="animate-spin" />
                  <p>Please wait...</p>
                </section>
              ) : (
                "Submit"
              )}
            </Button>

            {files.length > 0 ? (
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleCreateDraft}
                    disabled={files.length > 0}
                    variant={"outline"}
                    type="button"
                  >
                    {draftInfo ? "Update Draft" : "Save Draft"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary">
                  <p className="text-secondary-foreground">
                    Remove attachments before saving as draft.
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                onClick={handleCreateDraft}
                variant={"outline"}
                type="button"
              >
                {draftInfo ? "Update Draft" : "Save Draft"}
              </Button>
            )}
          </section>
        </form>
      </Form>
    </>
  );
}
