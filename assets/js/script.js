 $(document).ready(function() {
            const operators = ["Bruno Alves", "Eduardo", "Jorge", "Marcelo Capela", "Rafael Graça", "Sheldon"];

            $("#period").change(function() {
                const period = $(this).val();
                if (period === "Noturno") {
                    $("#dayDate").hide();
                    $("#startDateContainer, #endDateContainer").show();
                } else {
                    $("#dayDate").show();
                    $("#startDateContainer, #endDateContainer").hide();
                }
            });

            $("#weekendHoliday").change(function() {
                if ($(this).is(":checked")) {
                    $("#operatorName2Container, #noSecondOperatorContainer").show();
                    populateOperator2Options();
                } else {
                    $("#operatorName2Container, #noSecondOperatorContainer").hide();
                }
            });

            $("#noSecondOperator").change(function() {
                if ($(this).is(":checked")) {
                    $("#operatorName2").prop("disabled", true).val('');
                } else {
                    $("#operatorName2").prop("disabled", false);
                }
            });

            $("#operatorName").change(function() {
                if ($("#weekendHoliday").is(":checked")) {
                    populateOperator2Options();
                }
            });

            function populateOperator2Options() {
                const selectedOperator = $("#operatorName").val();
                $('#operatorName2').empty().append($('<option>', {
                    value: '',
                    text: 'Selecione...'
                }));

                operators.forEach(operator => {
                    if (operator !== selectedOperator) {
                        $('#operatorName2').append($('<option>', {
                            value: operator,
                            text: operator
                        }));
                    }
                });
            }

            $("#startDate").change(function() {
                const startDate = new Date($(this).val());
                if (startDate) {
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + 1);
                    $("#endDate").val(endDate.toISOString().slice(0, 10));
                } else {
                    $("#endDate").val('');
                }
            });

            $("#addRow").click(function() {
                const newRow = `<tr>
                    <td><input type="time" class="form-control" name="policeReportTime[]" required></td>
                    <td><input type="text" class="form-control policeReportLocation" name="policeReportLocation[]" required></td>
                    <td><input type="text" class="form-control policeReportObservation" name="policeReportObservation[]" required></td>
                    <td><button type="button" class="btn btn-danger remove-row">Remover</button></td>
                </tr>`;
                $("#policeReportTable tbody").append(newRow);
            });

            $(document).on("click", ".remove-row", function() {
                $(this).closest("tr").remove();
            });

            $("#mealTimeStart").change(function() {
                const start = $(this).val();
                let end;
                if (start) {
                    const [hours, minutes] = start.split(':').map(Number);
                    end = new Date(0, 0, 0, hours, minutes + 60, 0);
                } else {
                    end = "";
                }
                $("#mealTimeEnd").val(end ? `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}` : "");
            });

            $("#generateReport").click(function() {
                const operatorName = $("#operatorName").val();
                const period = $("#period").val();
                const date = $("#date").val();
                const startDate = $("#startDate").val();
                const endDate = $("#endDate").val();
                const mealTimeStart = $("#mealTimeStart").val();
                const mealTimeEnd = $("#mealTimeEnd").val();
                const policeReports = [];
                let valid = true;

                if (period === "Noturno" && !startDate) {
                    alert("Por favor, preencha a data de início.");
                    valid = false;
                }
                if (period === "Noturno" && !endDate) {
                    alert("Por favor, preencha a data de término.");
                    valid = false;
                }

                $("#policeReportTable tbody tr").each(function() {
                    const time = $(this).find("input[name='policeReportTime[]']").val();
                    const location = $(this).find("input[name='policeReportLocation[]']").val();
                    const observation = $(this).find("input[name='policeReportObservation[]']").val();

                    if (time && location && observation) {
                        policeReports.push({ time, location, observation });
                    } else {
                        alert("Por favor, preencha todos os campos da tabela de POLÍCIA MILITAR.");
                        valid = false;
                        return false;
                    }
                });

                if (valid) {
                    $("#reportOperatorName").text(operatorName);
                    $("#reportPeriod").text(period);
                    if (period === "Noturno") {
                        $("#reportStartDate").show();
                        $("#reportEndDate").show();
                        $("#reportDayDate").hide();
                        $("#reportStart").text(startDate);
                        $("#reportEnd").text(endDate);
                    } else {
                        $("#reportStartDate").hide();
                        $("#reportEndDate").hide();
                        $("#reportDayDate").show();
                        $("#reportDate").text(date);
                    }
                    $("#reportMealTime").text(`${mealTimeStart} - ${mealTimeEnd}`);

                    if (policeReports.length > 0) {
                        $("#noRondaMessage").hide();
                        $("#reportPoliceTable tbody").empty();
                        policeReports.forEach(report => {
                            $("#reportPoliceTable tbody").append(`<tr>
                                <td>${report.time}</td>
                                <td>${report.location}</td>
                                <td>${report.observation}</td>
                            </tr>`);
                        });
                    } else {
                        $("#noRondaMessage").show();
                        $("#reportPoliceTable tbody").empty();
                    }

                    $("#report").show();
                }
            });
        });