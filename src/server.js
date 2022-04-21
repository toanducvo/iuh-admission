const express = require("express");
const morgan = require("morgan");

const {
  isMobilePhone,
  isLength,
  isAlpha,
  isNumeric,
  isISO31661Alpha3,
  isAlphaLocales,
} = require("validator").default;
const admisstionsData = require("../data/admissions.json");

const app = express();
const port = 4000;

app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/apply/admission", (req, res) => {
  return res.render("admission");
});

app.post("/apply/admission/submit", (req, res) => {
  const {
    fullName,
    citizenId,
    issuedBy,
    issuedDate,
    gender,
    birthday,
    ethnic,
    phoneNumber,
    email,
    permanentAddress,
    contactAddress,
    school,
    gradYear,
    admissionArea,
    admissionPrior,
    major,
    group,
    isAdvanced,
    mathScore,
    physicsScore,
    chemistryScore,
    biologyScore,
    literatureScore,
    historyScore,
    geographyScore,
    foreignLanguageScore,
    civicEducationScore,
    applicationTerm,
  } = req.body;

  if (
    !/[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]/gm.test(
      fullName
    )
  ) {
    return res.status(200).json({
      status: "error",
      message: "Tên không được chứa kí tự đặc biệt",
    });
  }

  if (!phoneNumber.startsWith("0")) {
    const _phoneNumber = `0${phoneNumber}`;
    console.log(_phoneNumber);
    if (!isMobilePhone(_phoneNumber, "vi-VN")) {
      return res.status(200).json({
        status: "error",
        message: "Số điện thoại không hợp lệ",
      });
    }
  } else {
    if (!isMobilePhone(phoneNumber, "vi-VN")) {
      return res.status(200).json({
        status: "error",
        message: "Số điện thoại không hợp lệ",
      });
    }
  }

  if (!isNumeric(citizenId)) {
    return res.status(200).json({
      status: "error",
      message: "CMND/CCCD có độ dài 9 hoặc 12 ký tự số",
    });
  }

  if (!citizenId.length == 9 || !citizenId.length == 12) {
    return res.status(200).json({
      status: "error",
      message: "CMND/CCCD có độ dài 9 hoặc 12 ký tự số",
    });
  }

  if (gender === "gender") {
    return res.status(200).json({
      status: "error",
      message: "Giới tính chưa được chọn",
    });
  }

  if (
    !/[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]/gm.test(
      ethnic
    )
  ) {
    return res.status(200).json({
      status: "error",
      message: "Dân tộc có chứa kí tự đặc biệt",
    });
  }

  if (
    !/[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]/gm.test(
      school
    )
  ) {
    return res.status(200).json({
      status: "error",
      message: "Trường THPT không chứa kí tự đặc biệt",
    });
  }

  if (admissionArea === "0") {
    return res.status(200).json({
      status: "error",
      message: "Khu vực tuyển sinh chưa được chọn",
    });
  }

  if (major === "major") {
    return res.status(200).json({
      status: "error",
      message: "Ngành chưa được chọn",
    });
  }

  if (group === "group") {
    return res.status(200).json({
      status: "error",
      message: "Tổ hợp chưa được chọn",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Đăng ký thành công",
  });
});

app.post("/admissions", (req, res) => {
  return res.json(admisstionsData.majors);
});

app.post("/admissions/majors", (req, res) => {
  return res.json([
    ...admisstionsData.majors.flatMap((major) => {
      return {
        majorName: major.majorName,
        majorCode: major.majorCode,
      };
    }),
  ]);
});

app.post("/admissions/majors/:id", (req, res) => {
  const id = req.params.id;
  return res.json(
    admisstionsData.majors.find((major) => major.majorCode === id)
  );
});

app.post("/admissions/group", (req, res) => {
  return res.json(admisstionsData.admissionCombinedMapping);
});

app.post("/admissions/group/:id", (req, res) => {
  const id = req.params.id;
  const group = admisstionsData.admissionCombinedMapping[id];
  if (group) {
    return res.json(group);
  }
  return res.status(404).json({ message: "Group not found" });
});

app.get("/*", (req, res) => {
  return res.redirect("/apply/admission");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
